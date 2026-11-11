import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import prisma from './src/lib/prisma.js';

import authRoutes from './src/routes/authRoutes.js';
import eventoRoutes from './src/routes/eventoRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import postagemRoutes from './src/routes/postagemRoutes.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuração do Servidor Express
const app = express();
const PORT = process.env.PORT || 4000;
const PUBLIC_API_URL = (process.env.PUBLIC_API_URL || 'https://ibpj-api.onrender.com').replace(/\/+$/, '');
const APK_FALLBACK_URL =
    process.env.APK_DOWNLOAD_URL ||
    'https://github.com/Yue-rodri/igrejabatista/releases/latest/download/IBPJ-Mobile-release.apk';

// 2. Configuração de CORS para Produção em Nuvem (Render/Railway), APK Android (Capacitor) e Túneis
const rawCorsOrigin = process.env.CORS_ORIGIN || '*';
const allowedOriginsList = rawCorsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Permite chamadas diretas sem Origin (ex: mobile nativo, curl, healthchecks) ou quando CORS_ORIGIN="*"
        if (!origin || allowedOriginsList.includes('*')) {
            return callback(null, true);
        }
        // Permite sempre origens nativas do Capacitor Android/iOS e domínios de nuvem/túnel
        const isTrustedMobileOrCloud =
            origin === 'capacitor://localhost' ||
            origin === 'https://localhost' ||
            origin === 'http://localhost' ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.endsWith('.onrender.com') ||
            origin.endsWith('.up.railway.app') ||
            origin.endsWith('.loca.lt') ||
            origin.endsWith('.trycloudflare.com') ||
            origin.endsWith('.github.io') ||
            allowedOriginsList.includes(origin);

        if (isTrustedMobileOrCloud) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Bypass-Tunnel-Reminder',
        'ngrok-skip-browser-warning',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition'],
    optionsSuccessStatus: 204,
};

// Middleware para cabeçalhos extras de rede e carregamento de mídia/APK entre origens
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// 3. Arquivos Estáticos (Uploads, Landing Page de Download e QR Codes)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/download', express.static(path.join(__dirname, 'public', 'download')));
app.use(express.static(path.join(__dirname, 'public')));

function readActiveTunnelInfo() {
    try {
        const infoPath = path.join(__dirname, '.tunnel-info.json');
        if (fs.existsSync(infoPath)) {
            return JSON.parse(fs.readFileSync(infoPath, 'utf8'));
        }
    } catch {
        // ignore
    }
    return null;
}

function resolveLocalApkPath() {
    const candidates = [
        path.join(__dirname, 'public', 'apk', 'IBPJ-Mobile-release.apk'),
        path.resolve(__dirname, '../../IBPJ-Mobile-release.apk'),
        path.resolve(__dirname, '../../IBPJ-Mobile-v1.0.0-release.apk'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}

// 4. Rotas de Download do APK e Landing Page Oficial
app.get(['/download', '/app'], (req, res) => {
    const downloadPage = path.join(__dirname, 'public', 'download', 'index.html');
    if (fs.existsSync(downloadPage)) {
        return res.sendFile(downloadPage);
    }
    return res.redirect(APK_FALLBACK_URL);
});

app.get(['/apk', '/apk/IBPJ-Mobile-release.apk', '/download/IBPJ-Mobile-release.apk'], (req, res) => {
    const apkFile = resolveLocalApkPath();
    if (apkFile) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="IBPJ-Mobile-release.apk"');
        return res.sendFile(apkFile);
    }
    return res.redirect(APK_FALLBACK_URL);
});

// 5. Rotas de Saúde (Healthcheck para Render / Railway e App Mobile)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'ibpj-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (req, res) => {
    const tunnelInfo = readActiveTunnelInfo();
    res.status(200).json({
        message: 'IBPJ API está online!',
        database: 'Conectado ao PostgreSQL via Prisma',
        cloudUrl: PUBLIC_API_URL,
        downloadPageUrl: `${PUBLIC_API_URL}/download`,
        apkDownloadUrl: APK_FALLBACK_URL,
        timestamp: new Date().toISOString(),
        tunnel: tunnelInfo,
    });
});

app.get('/tunnel-info', (req, res) => {
    const tunnelInfo = readActiveTunnelInfo();
    res.status(200).json(
        tunnelInfo || {
            apiTunnelUrl: null,
            frontendTunnelUrl: null,
            cloudApiUrl: PUBLIC_API_URL,
            downloadPageUrl: `${PUBLIC_API_URL}/download`,
            apkDownloadUrl: APK_FALLBACK_URL,
        }
    );
});

// 6. Rotas Principais da Aplicação
app.use('/auth', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/users', userRoutes);
app.use('/postagens', postagemRoutes);

// 7. Inicializar o Servidor e a Conexão com o DB
async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Conexão com o PostgreSQL via Prisma estabelecida com sucesso!');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`📥 Página de Download & QR Code: http://localhost:${PORT}/download`);
        });
    } catch (e) {
        console.error('❌ Falha ao iniciar a API ou conectar ao banco de dados:', e);
        process.exit(1);
    }
}

main();

import 'dotenv/config';
import localtunnel from 'localtunnel';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const API_PORT = Number(process.env.PORT || 4000);
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 5173);
const args = process.argv.slice(2);
const forceLocaltunnel = args.includes('--lt');

const CLOUDFLARED_PATHS = [
    'C:\\Users\\yurer\\.gemini\\antigravity\\scratch\\tools\\cloudflared.exe',
    path.join(rootDir, 'bin', 'cloudflared.exe'),
    'cloudflared',
];

function findCloudflared() {
    if (forceLocaltunnel) return null;
    for (const candidate of CLOUDFLARED_PATHS) {
        if (candidate === 'cloudflared') continue;
        if (fs.existsSync(candidate)) return candidate;
    }
    return null;
}

async function isPortOnline(port) {
    try {
        const res = await fetch(`http://127.0.0.1:${port}/`, {
            headers: { 'Bypass-Tunnel-Reminder': 'true' },
            signal: AbortSignal.timeout(2500),
        });
        return res.ok;
    } catch {
        return false;
    }
}

let apiProcess = null;
const childProcesses = [];

async function ensureApiRunning() {
    if (await isPortOnline(API_PORT)) {
        console.log(`✅ API IBPJ já está online em http://127.0.0.1:${API_PORT}`);
        return;
    }
    console.log(`🚀 Iniciando API IBPJ na porta ${API_PORT}...`);
    apiProcess = spawn(process.execPath, ['index.js'], {
        cwd: rootDir,
        stdio: 'inherit',
        env: process.env,
    });
    childProcesses.push(apiProcess);

    for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (await isPortOnline(API_PORT)) return;
    }
}

function startCloudflaredTunnel(port) {
    const bin = findCloudflared();
    if (!bin) return Promise.reject(new Error('cloudflared not found'));

    return new Promise((resolve, reject) => {
        const proc = spawn(bin, ['tunnel', '--url', `http://127.0.0.1:${port}`, '--no-autoupdate'], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        childProcesses.push(proc);

        let resolved = false;
        const urlRegex = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i;

        const onData = (chunk) => {
            const text = chunk.toString();
            const match = text.match(urlRegex);
            if (match && !resolved) {
                resolved = true;
                resolve({ url: match[0], provider: 'cloudflare', proc });
            }
        };

        proc.stdout.on('data', onData);
        proc.stderr.on('data', onData);

        proc.on('error', (err) => {
            if (!resolved) reject(err);
        });

        setTimeout(() => {
            if (!resolved) reject(new Error('Timeout waiting for Cloudflare tunnel URL'));
        }, 20000);
    });
}

async function openTunnelForPort(port) {
    try {
        return await startCloudflaredTunnel(port);
    } catch {
        const lt = await localtunnel({ port, local_host: '127.0.0.1' });
        return { url: lt.url, provider: 'localtunnel', proc: lt };
    }
}

async function main() {
    await ensureApiRunning();

    console.log(`\n☁️  Abrindo túnel em nuvem HTTPS para a API (porta ${API_PORT})...`);
    const apiTunnel = await openTunnelForPort(API_PORT);

    let frontendTunnel = null;
    if (args.includes('--with-frontend') || (await isPortOnline(FRONTEND_PORT))) {
        try {
            console.log(`☁️  Abrindo túnel em nuvem HTTPS para o App Web (porta ${FRONTEND_PORT})...`);
            frontendTunnel = await openTunnelForPort(FRONTEND_PORT);
        } catch (err) {
            console.warn(`⚠️  Túnel do frontend não iniciado: ${err.message}`);
        }
    }

    const infoPayload = {
        provider: apiTunnel.provider,
        apiTunnelUrl: apiTunnel.url,
        downloadPageUrl: `${apiTunnel.url}/download`,
        apkDirectUrl: `${apiTunnel.url}/apk/IBPJ-Mobile-release.apk`,
        frontendTunnelUrl: frontendTunnel?.url || null,
        localApiUrl: `http://localhost:${API_PORT}`,
        startedAt: new Date().toISOString(),
    };

    const infoFile = path.join(rootDir, '.tunnel-info.json');
    fs.writeFileSync(infoFile, JSON.stringify(infoPayload, null, 2), 'utf8');

    try {
        const frontPublicInfo = path.resolve(rootDir, '../../Front/front-ibpj/public/tunnel-info.json');
        fs.writeFileSync(frontPublicInfo, JSON.stringify(infoPayload, null, 2), 'utf8');
    } catch {
        // ignore
    }

    console.log('\n====================================================================');
    console.log(`🎉 IBPJ MOBILE — NUVEM HTTPS ATIVA (${apiTunnel.provider.toUpperCase()})`);
    console.log('====================================================================');
    if (frontendTunnel?.url) {
        console.log(`📱 App Web na Nuvem (Abrir):    ${frontendTunnel.url}`);
    }
    console.log(`🔗 API Backend na Nuvem:        ${apiTunnel.url}`);
    console.log(`📥 Página de Download + QR:     ${apiTunnel.url}/download`);
    console.log(`📦 Download Direto do APK:      ${apiTunnel.url}/apk/IBPJ-Mobile-release.apk`);
    console.log('====================================================================\n');
}

function cleanup() {
    for (const p of childProcesses) {
        try {
            p.kill();
        } catch {
            // ignore
        }
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main().catch((err) => {
    console.error('❌ Erro ao iniciar túnel:', err);
    process.exit(1);
});

import 'dotenv/config';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(apiRoot, '../..');

const args = process.argv.slice(2);
const customUrlArg = args.find((a) => a.startsWith('--url='))?.split('=')[1];

// 1. URL Pública Permanente da Landing Page de Download na Nuvem
const PUBLIC_API_URL = (process.env.PUBLIC_API_URL || 'https://ibpj-api.onrender.com').replace(/\/+$/, '');
const DOWNLOAD_PAGE_URL =
    customUrlArg ||
    process.env.DOWNLOAD_PAGE_URL ||
    `${PUBLIC_API_URL}/download`;

// 2. URL Pública Permanente de Download Direto via GitHub Releases
const GITHUB_RELEASE_APK_URL =
    process.env.APK_DOWNLOAD_URL ||
    'https://github.com/Yue-rodri/igrejabatista/releases/latest/download/IBPJ-Mobile-release.apk';

const QR_OPTIONS_PNG = {
    type: 'png',
    width: 1200,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
        dark: '#001B30', // Azul-marinho institucional IBPJ
        light: '#FFFFFF',
    },
};

const QR_OPTIONS_SVG = {
    type: 'svg',
    width: 1200,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
        dark: '#001B30',
        light: '#FFFFFF',
    },
};

async function generateAllQrCodes() {
    console.log('====================================================================');
    console.log('📱 GERADOR DE QR CODE PERMANENTE — IBPJ MOBILE');
    console.log('====================================================================');
    console.log(`🔗 URL Principal (Landing Page): ${DOWNLOAD_PAGE_URL}`);
    console.log(`📦 URL Direta (GitHub Release):  ${GITHUB_RELEASE_APK_URL}\n`);

    const outputDirs = [
        repoRoot,
        path.join(apiRoot, 'public', 'download'),
        path.join(repoRoot, 'docs'),
        path.join(repoRoot, 'Front', 'front-ibpj', 'public'),
    ];

    for (const dir of outputDirs) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Gera buffer PNG (1200x1200) e string SVG para a Landing Page de Download
    const pagePngBuffer = await QRCode.toBuffer(DOWNLOAD_PAGE_URL, QR_OPTIONS_PNG);
    const pageSvgString = await QRCode.toString(DOWNLOAD_PAGE_URL, QR_OPTIONS_SVG);

    // Gera buffer PNG (1200x1200) e string SVG para o Download Direto do APK (GitHub Releases)
    const releasePngBuffer = await QRCode.toBuffer(GITHUB_RELEASE_APK_URL, QR_OPTIONS_PNG);
    const releaseSvgString = await QRCode.toString(GITHUB_RELEASE_APK_URL, QR_OPTIONS_SVG);

    for (const dir of outputDirs) {
        fs.writeFileSync(path.join(dir, 'qrcode-ibpj-mobile.png'), pagePngBuffer);
        fs.writeFileSync(path.join(dir, 'qrcode-ibpj-mobile.svg'), pageSvgString, 'utf8');
        fs.writeFileSync(path.join(dir, 'qrcode-ibpj-github-release.png'), releasePngBuffer);
        fs.writeFileSync(path.join(dir, 'qrcode-ibpj-github-release.svg'), releaseSvgString, 'utf8');
    }

    console.log('✅ Arquivos gerados em alta resolução (1200x1200px PNG & Vetor SVG):');
    console.log(`   - ${path.join(repoRoot, 'qrcode-ibpj-mobile.png')}`);
    console.log(`   - ${path.join(repoRoot, 'qrcode-ibpj-mobile.svg')}`);
    console.log(`   - ${path.join(repoRoot, 'qrcode-ibpj-github-release.png')}`);
    console.log(`   - ${path.join(repoRoot, 'qrcode-ibpj-github-release.svg')}`);
    console.log('====================================================================\n');
}

generateAllQrCodes().catch((err) => {
    console.error('❌ Erro ao gerar QR Codes:', err);
    process.exit(1);
});

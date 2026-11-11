# Guia de Publicação em Nuvem e Distribuição Permanente do APK (QR Code)

> **Projeto**: IBPJ Mobile — *Premium Glass Experience* (`br.org.ibpj.mobile`)  
> **URL Pública Padrão da API**: `https://ibpj-api.onrender.com`  
> **Landing Page de Download**: `https://ibpj-api.onrender.com/download` (ou via GitHub Pages)  
> **Download Direto do APK (GitHub Releases)**: `https://github.com/GelimTH/projeto-igreja-ibpj/releases/latest/download/IBPJ-Mobile-release.apk`

---

## 1. Arquitetura de Publicação em Nuvem Implementada

| Componente | Arquivo de Configuração | Plataforma Recomendada | URL Permanente |
|---|---|---|---|
| **API Node.js + Express + Prisma** | `render.yaml` / `Back/ibpj-api/railway.json` / `Dockerfile` | **Render** (Blueprint) ou **Railway** | `https://ibpj-api.onrender.com` |
| **Banco PostgreSQL Gerenciado** | `render.yaml` (`ibpj-postgres`) | **Render PostgreSQL** / **Railway** | Interno via `DATABASE_URL` |
| **Landing Page de Download + QR Code** | `Back/ibpj-api/public/download/index.html` e `docs/index.html` | Servida pela API (`/download`) e **GitHub Pages** | `https://ibpj-api.onrender.com/download` |
| **Hospedagem Permanente do APK** | `.github/workflows/release-android.yml` + `public/apk/` | **GitHub Releases** + Mirror na API (`/apk`) | `https://github.com/GelimTH/projeto-igreja-ibpj/releases/latest/download/IBPJ-Mobile-release.apk` |
| **QR Codes em Alta Resolução** | `Back/ibpj-api/scripts/generate-qrcode.js` | PNG (1200x1200px) e Vetor SVG | `qrcode-ibpj-mobile.png` / `.svg` |

---

## 2. Passo a Passo para Publicar na Nuvem

### Etapa 1 — Enviar o Código e o APK para o Repositório GitHub

No terminal PowerShell, dentro da pasta do projeto:

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj"
git add -A
git commit -m "feat(cloud): add Render/Railway deploy blueprint, download landing page, and permanent QR code"
git push -u origin feat/ibpj-mobile-android
```

*(Caso queira acionar imediatamente a criação automática da Release `v1.0.0` no GitHub Releases com o arquivo `IBPJ-Mobile-release.apk` anexado, publique também a tag `v1.0.0`):*

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Assim que o push for concluído, o workflow `.github/workflows/release-android.yml` publicará automaticamente o arquivo `IBPJ-Mobile-release.apk` em:
- **`https://github.com/GelimTH/projeto-igreja-ibpj/releases/latest/download/IBPJ-Mobile-release.apk`**

---

### Etapa 2 — Deploy Automático da API + PostgreSQL no Render (Gratuito)

O arquivo `render.yaml` na raiz do projeto configura toda a infraestrutura como código (*Blueprint*):

1. Acesse **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)** e clique em **New Blueprint Instance**.
2. Selecione o repositório **`GelimTH/projeto-igreja-ibpj`** e a branch **`feat/ibpj-mobile-android`** (ou `main`).
3. Clique em **Apply**. O Render criará automaticamente:
   - O banco de dados PostgreSQL **`ibpj-postgres`**;
   - O serviço web **`ibpj-api`** com `DATABASE_URL` e `JWT_SECRET` injetados automaticamente, executando `npx prisma generate && npx prisma migrate deploy && node prisma/seed.js` no build;
   - O site estático **`ibpj-mobile-web`** (opcional).
4. Ao finalizar o deploy, sua API estará online em **`https://ibpj-api.onrender.com`** e a página oficial de download com QR Code estará ativa em **`https://ibpj-api.onrender.com/download`**.

#### Alternativa: Deploy no Railway
Se preferir utilizar o **Railway** (`Back/ibpj-api/railway.json` e `Back/ibpj-api/Dockerfile`):
1. Crie um novo projeto no Railway conectado ao repositório GitHub.
2. Adicione um serviço **PostgreSQL** (+ New → Database → PostgreSQL).
3. Configure o `Root Directory` do serviço da API para `Back/ibpj-api` e defina as variáveis `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `JWT_SECRET`, `CORS_ORIGIN=*` e `PUBLIC_API_URL`.

---

### Etapa 3 — Como Regerar o QR Code Permanente (Caso Mude de Domínio)

Se o domínio gerado na nuvem tiver um nome personalizado (ex.: `https://api.ibpj.org.br`), basta executar um único comando para regerar os arquivos `PNG` (1200x1200px) e `SVG`:

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Back\ibpj-api"
npm.cmd run qr:generate -- --url=https://seu-dominio-na-nuvem.onrender.com/download
```
*(Ou simplesmente `npm.cmd run qr:generate` para usar o valor de `PUBLIC_API_URL` definido no `.env`).*

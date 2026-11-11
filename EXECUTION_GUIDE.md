# Guia de Execução e Compilação — IBPJ Mobile (Android & Full-Stack)

> **Projeto**: IBPJ Mobile — *Premium Glass Experience* (`br.org.ibpj.mobile`)  
> **Repositório Base**: `https://github.com/GelimTH/projeto-igreja-ibpj`  
> **Branch Mobile**: `feat/ibpj-mobile-android`  
> **Diretório do Projeto**: `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj`  
> **Backup Intacto do Original**: `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj-original`

---

## 1. Visão Geral da Estrutura do Projeto

```text
projeto-igreja-ibpj/
├── Back/
│   └── ibpj-api/                  # Backend Node.js + Express 5 + Prisma ORM + PostgreSQL
│       ├── prisma/
│       │   ├── schema.prisma      # Modelos: User, Evento, Postagem
│       │   ├── migrations/        # Migrations SQL oficiais
│       │   └── seed.js            # Seed do usuário administrador (DESENVOLVEDOR)
│       ├── public/uploads/        # Diretório de imagens enviadas pelo painel admin
│       ├── src/                   # Controllers, Middlewares (JWT/Admin) e Routes
│       ├── .env                   # Configuração DATABASE_URL, JWT_SECRET e PORT
│       └── index.js               # Entrypoint HTTP REST (porta 4000)
│
├── Front/
│   └── front-ibpj/                # Aplicação Mobile-First React 19 + Vite 7 + Capacitor 7
│       ├── android/               # Projeto Android Nativo (Gradle + SDK 35 + Keystore)
│       │   └── app/
│       │       ├── ibpj-release-key.jks
│       │       └── build/outputs/apk/
│       │           ├── debug/app-debug.apk
│       │           └── release/app-release.apk
│       ├── src/
│       │   ├── api/core.js        # Cliente Axios dinâmico + @capacitor/preferences
│       │   ├── components/        # GlassPrimitives, BottomNav, MobileHeader, Modais
│       │   ├── context/           # AuthContext (JWT + sessão + saúde da API)
│       │   ├── integrations/      # Recursos nativos (Share, Clipboard, Maps, StatusBar)
│       │   ├── pages/             # 10 telas mobile redesenhadas (Home, Eventos, etc.)
│       │   └── utils/             # Parser de datas sem bug de fuso UTC-3
│       └── capacitor.config.json  # Configuração Capacitor (br.org.ibpj.mobile)
│
├── IBPJ-Mobile-v1.0.0-release.apk # APK de produção assinado pronto para instalação
├── IBPJ-Mobile-v1.0.0-debug.apk   # APK de debug para testes rápidos
├── MOBILE_AUDIT.md                # Fase 1: Auditoria Técnica Completa
├── MOBILE_ARCHITECTURE.md         # Fase 2: Decisão Arquitetural e Design System
├── EXECUTION_GUIDE.md             # Guia de Execução e Build Android
└── TEST_REPORT.md                 # Fase 7 & 8: Relatório de Testes e Verificação do APK
```

---

## 2. Pré-Requisitos de Ambiente

- **Node.js**: v20+ (testado e validado em Node.js v26.13.0)
- **Banco de Dados PostgreSQL**:
  - Instância PostgreSQL 15/16 local (`localhost:5432`) ou servidor PostgreSQL portátil incluso em `C:\Users\yurer\.gemini\antigravity\scratch\tools\pg-server\server.mjs`.
- **Ambiente de Build Android**:
  - **JDK 21** (instalado em `C:\Users\yurer\.gemini\antigravity\scratch\tools\jdk21`)
  - **Android SDK Platform 35 & Build-Tools 35.0.0** (instalado em `C:\Users\yurer\.gemini\antigravity\scratch\tools\android-sdk`)

---

## 3. Como Executar o Banco de Dados e o Backend (`Back/ibpj-api`)

### 3.1. Iniciar o PostgreSQL Local
Caso não possua um serviço PostgreSQL rodando na porta `5432`, inicie o servidor PostgreSQL local persistente:

```powershell
node "C:\Users\yurer\.gemini\antigravity\scratch\tools\pg-server\server.mjs"
```

### 3.2. Configurar Variáveis de Ambiente (`Back/ibpj-api/.env`)
O arquivo `Back/ibpj-api/.env` já está configurado com:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public&sslmode=disable&pgbouncer=true&connection_limit=1"
JWT_SECRET="ibpj-mobile-jwt-secret-key-2026"
PORT=4000
```

### 3.3. Instalar Dependências, Gerar Prisma Client e Popular Dados (`seed`)

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Back\ibpj-api"
npm.cmd install
npx.cmd prisma generate
node prisma/seed.js
```

> **Credenciais Administrativas Criadas pelo Seed**:
> - **E-mail**: `admin@ibpj.com`
> - **Senha**: `adminpassword123`
> - **Role**: `DESENVOLVEDOR` (acesso total ao Painel Admin mobile, eventos, postagens e usuários)

### 3.4. Iniciar o Servidor da API REST

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Back\ibpj-api"
node index.js
```
A API ficará disponível em `http://localhost:4000`.

---

## 4. Como Executar o Frontend Mobile no Navegador (`Front/front-ibpj`)

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Front\front-ibpj"
npm.cmd install
npm.cmd run dev
```
Acesse `http://localhost:5173`. Para inspecionar na proporção de smartphone, utilize o modo de dispositivo móvel do navegador (ex.: `390x844` ou `412x915`).

---

## 5. Configuração da URL da API no Android (Emulador vs. Celular Físico)

O aplicativo **IBPJ Mobile** resolve automaticamente o endpoint da API através de `src/api/core.js`, além de oferecer configuração dinâmica em tempo de execução sem necessidade de recompilar o APK:

1. **Emulador Android (AVD)**:
   - Detecta automaticamente a plataforma nativa Android e utiliza `http://10.0.2.2:4000` (que mapeia para o `localhost:4000` da máquina host).
2. **Smartphone Android Físico (Mesma Rede Wi-Fi / LAN) ou Servidor em Produção**:
   - No cabeçalho superior do aplicativo, toque no indicador de conexão (**Online / Offline**) ou acesse **Mais → Configurar Servidor da API**.
   - Insira o IP da sua máquina na rede local (ex.: `http://192.168.1.100:4000`) ou o domínio HTTPS de produção e toque em **Testar Conexão** e **Salvar e Aplicar**.

---

## 6. Como Sincronizar e Gerar o APK Android (`.apk`)

### 6.1. Build Web + Sincronização com Capacitor Android

Sempre que alterar arquivos em `Front/front-ibpj/src`, execute:

```powershell
cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Front\front-ibpj"
npm.cmd run android:build
```
*(Esse script executa `vite build && cap sync android`, copiando os assets otimizados para `android/app/src/main/assets/public`).*

### 6.2. Compilar APK de Debug e APK de Produção Assinado via Linha de Comando

```powershell
$env:JAVA_HOME = "C:\Users\yurer\.gemini\antigravity\scratch\tools\jdk21"
$env:ANDROID_HOME = "C:\Users\yurer\.gemini\antigravity\scratch\tools\android-sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

cd "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Front\front-ibpj\android"
.\gradlew.bat assembleRelease assembleDebug
```

Os arquivos `.apk` gerados ficam localizados em:
- **APK de Produção (Assinado)**:
  - `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\IBPJ-Mobile-v1.0.0-release.apk`
  - `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Front\front-ibpj\android\app\build\outputs\apk\release\app-release.apk`
- **APK de Debug**:
  - `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\IBPJ-Mobile-v1.0.0-debug.apk`
  - `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\Front\front-ibpj\android\app\build\outputs\apk\debug\app-debug.apk`

### 6.3. Como Instalar o APK em um Dispositivo ou Emulador via ADB

Com a Depuração USB ativada no aparelho Android:

```powershell
C:\Users\yurer\.gemini\antigravity\scratch\tools\android-sdk\platform-tools\adb.exe install -r "C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\IBPJ-Mobile-v1.0.0-release.apk"
```
Ou transfira o arquivo `IBPJ-Mobile-v1.0.0-release.apk` diretamente para o smartphone Android e abra-o pelo gerenciador de arquivos.

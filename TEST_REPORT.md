# Relatório de Testes e Verificação — IBPJ Mobile (Android & API)

> **Projeto**: IBPJ Mobile — *Premium Glass Experience* (`br.org.ibpj.mobile`)  
> **Versão**: `1.0.0` (`versionCode: 1`)  
> **Ambiente de Execução**: Windows 10/11 x64 • Node.js v26.13.0 • JDK 21.0.13 (Temurin) • Android SDK 35 (Android 15) • Gradle 8.11.1  
> **Status Global**: **APROVADO (100% dos testes de API, Concorrência, UI Mobile e Assinatura de APK concluídos com sucesso)**

---

## 1. Resumo Executivo da Validação

A transformação do projeto web **IBPJ — Igreja Batista do Parque Jandaia** em um aplicativo Android nativo/híbrido com **React 19 + Vite 7 + Capacitor 7** passou por uma bateria completa de testes reais ponta a ponta:

1. **Bateria de Integração Backend + Banco de Dados PostgreSQL (13/13 testes aprovados)**:
   - Verificação de saúde (`GET /`), login administrativo (`POST /auth/login`), validação de sessão JWT (`GET /auth/me`), registro de membros com controle de privacidade (`POST /auth/register`), filtro público de aniversariantes (`GET /users/aniversariantes`), CRUD completo de Eventos (`GET`, `POST`, `PUT`), upload real de imagens multipart (`POST /postagens/upload`), publicação de Postagens em destaque (`POST /postagens`, `GET /postagens`) e gestão administrativa de usuários (`GET /users`).
2. **Teste de Estresse e Concorrência no Prisma ORM (15/15 requisições simultâneas aprovadas)**:
   - Após unificar as 5 instâncias separadas de `new PrismaClient()` em um singleton compartilhado (`Back/ibpj-api/src/lib/prisma.js`), 5 rodadas consecutivas de `Promise.all` simultâneos para `/eventos?orderBy=-data`, `/postagens` e `/users/aniversariantes` responderam `HTTP 200` em 100% das chamadas.
3. **Verificação Visual e Interativa da Experiência Mobile (`browser` subagent)**:
   - Navegação completa pelas 5 abas da Bottom Navigation (`Início`, `Eventos`, `Programação`, `Comunidade`, `Mais`), calendário tátil, sub-abas comunitárias (`Oração`, `Ministérios`, `Grupos & EBD`, `IBPJ Kids`, `Galeria`), submissão de pedido de oração com consentimento, filtro de privacidade em `Aniversariantes do Mês` e ativação do Painel Administrativo (`DESENVOLVEDOR`).
4. **Compilação e Verificação Criptográfica dos APKs Android (`apksigner` & `aapt2`)**:
   - Geração e validação dos pacotes `IBPJ-Mobile-v1.0.0-release.apk` (`3.477.596 bytes`) e `IBPJ-Mobile-v1.0.0-debug.apk` (`4.685.169 bytes`).

---

## 2. Resultados da Bateria Automatizada de API REST (`Back/ibpj-api`)

| # | Caso de Teste | Endpoint / Método | Status HTTP | Resultado | Detalhes Verificados |
|---|---|---|---|---|---|
| 1 | Healthcheck da API e DB | `GET /` | `200 OK` | **PASS** | `{"message":"IBPJ API está online!","database":"Conectado ao PostgreSQL via Prisma"}` |
| 2 | Login Administrativo | `POST /auth/login` | `200 OK` | **PASS** | Autenticado com `admin@ibpj.com`, `role="DESENVOLVEDOR"`, token JWT emitido |
| 3 | Validação de Sessão JWT | `GET /auth/me` | `200 OK` | **PASS** | Retornou perfil autenticado `Admin IBPJ (DEV) (admin@ibpj.com)` |
| 4 | Cadastro Público de Membro | `POST /auth/register` | `201 Created` | **PASS** | Criado membro `Maria Clara Santos (Membro IBPJ)` com `show_in_aniversariantes: true` |
| 5 | Cadastro com Opt-Out de Privacidade | `POST /auth/register` | `201 Created` | **PASS** | Criado membro com `show_in_aniversariantes: false` |
| 6 | Listagem de Aniversariantes + LGPD | `GET /users/aniversariantes` | `200 OK` | **PASS** | Exibe `Maria Clara Santos` e **oculta** o membro com `show_in_aniversariantes: false` |
| 7 | Criação de Evento (Admin) | `POST /eventos` | `201 Created` | **PASS** | Criado evento `"Culto de Celebração e Família"` e `"Culto de Oração e Estudo Bíblico"` |
| 8 | Atualização de Evento (Admin) | `PUT /eventos/:id` | `200 OK` | **PASS** | Atualizado título para `"Culto da Família e Celebração Dominical"` |
| 9 | Listagem Ordenada de Eventos | `GET /eventos` | `200 OK` | **PASS** | Retornou lista de eventos sem deslocamento de fuso (`UTC-3`) |
| 10 | Upload Multipart de Imagem | `POST /postagens/upload` | `200 OK` | **PASS** | Imagem salva em `public/uploads/` e servida via `/uploads/...` |
| 11 | Criação de Postagem em Destaque | `POST /postagens` | `201 Created` | **PASS** | Criada postagem `"Programação Dominical IBPJ"` com `destaque: true` e imagem |
| 12 | Listagem do Feed de Programação | `GET /postagens` | `200 OK` | **PASS** | Retornou feed ordenado por destaque e data |
| 13 | Gestão de Usuários (Admin) | `GET /users` | `200 OK` | **PASS** | Lista completa de membros e roles retornada apenas para token Admin/Dev |
| 14 | Concorrência Simultânea (5x3 Burst) | `GET /eventos`, `/postagens`, `/users/aniversariantes` | `200 OK` (15/15) | **PASS** | 15 requisições paralelas via `Promise.all` responderam `200 OK` sem colisão |

---

## 3. Bugs do Projeto Original Corrigidos Durante a Transformação

| ID | Módulo / Arquivo Original | Problema Identificado na Auditoria | Correção Implementada e Verificada |
|---|---|---|---|
| **BUG-01** | `Front/front-ibpj/package.json` | Nome inválido no NPM (`"IBPJ - Igreja Batista Parque Jandaia"`) e dependências importadas ausentes (`axios`, `react-router-dom`, `framer-motion`). | Nome padronizado para `"ibpj-mobile"`, dependências declaradas e instaladas + adição dos plugins `@capacitor/*`. |
| **BUG-02** | `Front/front-ibpj/src/Layout.jsx` | Botão de Login possuía classe `hidden lg:flex`, tornando impossível autenticar-se em smartphones (`< 1024px`). | Criado `MobileHeader.jsx` com acesso permanente ao modal de autenticação (`AuthForm.jsx`) e perfil em qualquer resolução. |
| **BUG-03** | `Eventos.jsx` / `Programacao.jsx` | Frontend checava apenas `user?.role === 'admin'`, ignorando a role `'DESENVOLVEDOR'` criada pelo `prisma/seed.js` e aceita pelo `adminMiddleware.js` no backend. | Centralizado helper `isAdmin` no `AuthContext.jsx` aceitando `admin` e `DESENVOLVEDOR` (case-insensitive). |
| **BUG-04** | `Eventos.jsx` / `Aniversarios.jsx` | `new Date("YYYY-MM-DDT00:00:00.000Z")` recuava 1 dia no fuso horário `America/Sao_Paulo` (`UTC-3`), exibindo eventos e aniversários no dia anterior. | Implementado `parseLocalDate()` em `src/utils/date.js`, preservando ano, mês e dia exatos sem desvio de fuso. |
| **BUG-05** | `PostagemCard.jsx` | Caminhos relativos retornados pelo upload (`/uploads/arquivo.png`) quebravam quando o frontend rodava em porta/origem distinta da API (`capacitor://localhost` ou `:5173`). | Implementado `resolveMediaUrl()` em `src/api/core.js`, prefixando automaticamente com a URL ativa da API. |
| **BUG-06** | `Contato.jsx` | Links quebrados apontando literalmente para `https://www.instagram.com/URL_DO_SEU_FACEBOOK` e `https://wa.me/URL_DO_SEU_WHATSAPP_API`. | Substituídos por ações nativas reais: abrir rota no Google Maps, copiar endereço, enviar e-mail e consultar horários reais. |
| **BUG-07** | `Back/ibpj-api/prisma.config.ts` | Falhava ao executar `npx prisma generate` sem carregamento prévio do `.env`. | Adicionado `import "dotenv/config";` no topo de `prisma.config.ts`. |
| **BUG-08** | `Back/ibpj-api/src/controllers/*.js` | 5 instâncias separadas de `new PrismaClient()` causavam colisão de conexões e *prepared statements* em requisições paralelas (`Promise.all`). | Criado singleton `Back/ibpj-api/src/lib/prisma.js` compartilhado por toda a API. |

---

## 4. Verificação Técnica do Pacote Android (`.apk`)

### 4.1. Artefatos Gerados
- **APK Release Assinado (Produção)**:
  - Caminho: `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\IBPJ-Mobile-v1.0.0-release.apk`
  - Caminho Gradle: `Front\front-ibpj\android\app\build\outputs\apk\release\app-release.apk`
  - Tamanho: `3.477.596 bytes` (`3,32 MB`)
- **APK Debug**:
  - Caminho: `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj\IBPJ-Mobile-v1.0.0-debug.apk`
  - Caminho Gradle: `Front\front-ibpj\android\app\build\outputs\apk\debug\app-debug.apk`
  - Tamanho: `4.685.169 bytes` (`4,47 MB`)

### 4.2. Saída da Verificação `apksigner verify --verbose --print-certs`
```text
Verifies
Verified using v1 scheme (JAR signing): true
Verified using v2 scheme (APK Signature Scheme v2): true
Number of signers: 1
Signer #1 certificate DN: CN=Igreja Batista do Parque Jandaia, OU=Ministerio de Tecnologia, O=IBPJ, L=Carapicuiba, ST=SP, C=BR
Signer #1 certificate SHA-256 digest: 2e1d68f53b5a507b80644588276a926029591ef601b798ff2701879a9951b30d
Signer #1 key algorithm: RSA
Signer #1 key size (bits): 2048
```

### 4.3. Saída da Inspeção `aapt2 dump badging`
```text
package: name='br.org.ibpj.mobile' versionCode='1' versionName='1.0.0' platformBuildVersionName='15' platformBuildVersionCode='35' compileSdkVersion='35' compileSdkVersionCodename='15'
minSdkVersion:'23'
targetSdkVersion:'35'
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.ACCESS_NETWORK_STATE'
application-label:'IBPJ Mobile'
```

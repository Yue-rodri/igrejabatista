# AUDITORIA TÉCNICA — IBPJ MOBILE (`MOBILE_AUDIT.md`)

**Projeto:** IBPJ — Igreja Batista do Parque Jandaia  
**Repositório Oficial Auditado:** `https://github.com/GelimTH/projeto-igreja-ibpj` (branch `main`, commit `ee3a6ac070ed3b5faef3fffe3d92fa59b2c6a873`)  
**Diretório de Trabalho Local:** `C:\Users\yurer\.gemini\antigravity\scratch\projeto-igreja-ibpj`  
**Data da Auditoria:** 10 de novembro de 2026  

---

## 1. Diagnóstico Geral da Arquitetura

O repositório oficial está estruturado como um monorepo simples contendo duas aplicações independentes:

```text
projeto-igreja-ibpj/
├── Back/
│   └── ibpj-api/          # API RESTful em Node.js (ES Modules) + Express 5 + Prisma 6 + PostgreSQL
├── Front/
│   └── front-ibpj/        # SPA em React 19 + Vite 7 + Tailwind CSS 3.4 + Radix UI (Shadcn UI)
└── README.md              # Guia de instalação e execução local
```

### 1.1 Backend (`Back/ibpj-api`)
- **Runtime & Módulo:** Node.js com `"type": "module"` (ES Modules).
- **Framework HTTP:** Express `^5.1.0`, configurado na porta `process.env.PORT || 4000`.
- **ORM & Banco de Dados:** Prisma `^6.18.0` com provider `postgresql` (`DATABASE_URL`).
- **Autenticação & Segurança:**
  - Senhas criptografadas com `bcrypt` (`^6.0.0`, 10 salt rounds).
  - Tokens JWT assinados via `jsonwebtoken` (`^9.0.2`) com expiração de `7d` e payload `{ id, role }`.
  - Middleware de autenticação (`src/utils/authMiddleware.js`) que extrai `Bearer <token>` do header `Authorization` e injeta `req.userId`.
  - Middleware de autorização (`adminMiddleware`) que consulta o banco e permite acesso apenas a usuários com `role === 'admin'` ou `role === 'DESENVOLVEDOR'`.
- **Upload de Arquivos:** `multer` (`^2.0.2`) salvando imagens de até 10 MB em `public/uploads/` e expondo estaticamente via `app.use(express.static(path.join(__dirname, 'public')))`.

### 1.2 Modelos Prisma (`Back/ibpj-api/prisma/schema.prisma`)
Existem exatamente **3 modelos** implementados e migrados no banco de dados:
1. **`User`**:
   - `id` (Int, PK, autoincrement)
   - `email` (String, unique)
   - `password` (String, hash bcrypt)
   - `full_name` (String?)
   - `data_nascimento` (DateTime?, `@db.Date`)
   - `role` (String, default `"member"` — valores utilizados: `"member"`, `"admin"`, `"DESENVOLVEDOR"`)
   - `show_in_aniversariantes` (Boolean, default `true`)
   - `createdAt`, `updatedAt`
2. **`Evento`**:
   - `id` (Int, PK, autoincrement)
   - `titulo` (String)
   - `descricao` (String?)
   - `data` (DateTime, `@db.Date`)
   - `hora` (String)
   - `tipo` (String — ex.: `culto`, `estudo_biblico`, `reuniao_oracao`, `evento_especial`, `vigilia`, `encontro_jovens`, `escola_dominical`, `outro`)
   - `local` (String?, default `"Igreja IBPJ"`)
   - `createdAt`, `updatedAt`
3. **`Postagem`**:
   - `id` (Int, PK, autoincrement)
   - `titulo` (String)
   - `descricao` (String)
   - `data` (DateTime, `@db.Date`)
   - `hora` (String?)
   - `imagem_url` (String?)
   - `destaque` (Boolean, default `false`)
   - `createdAt`, `updatedAt`

### 1.3 Endpoints REST Implementados no Backend

| Método | Rota | Acesso | Controller | Descrição |
|---|---|---|---|---|
| `GET` | `/` | Público | `index.js` | Healthcheck da API (`IBPJ API está online!`) |
| `POST` | `/auth/register` | Público | `authController.register` | Cadastro de novo membro com opção `show_in_aniversariantes` |
| `POST` | `/auth/login` | Público | `authController.login` | Autentica usuário e retorna `{ token, user }` |
| `GET` | `/auth/me` | Autenticado (`JWT`) | `authController.me` | Retorna dados do usuário logado (`id, email, full_name, role, data_nascimento`) |
| `GET` | `/eventos` | Público | `eventoController.listEventos` | Lista eventos ordenados por `orderBy` (default `-data`) |
| `POST` | `/eventos` | Admin / DEV | `eventoController.createEvento` | Cria novo evento |
| `PUT` | `/eventos/:id` | Admin / DEV | `eventoController.updateEvento` | Atualiza evento existente |
| `DELETE` | `/eventos/:id` | Admin / DEV | `eventoController.deleteEvento` | Exclui evento |
| `GET` | `/postagens` | Público | `postagemController.listPostagens` | Lista postagens ordenadas por `data desc` |
| `POST` | `/postagens` | Admin / DEV | `postagemController.createPostagem` | Cria nova postagem |
| `PUT` | `/postagens/:id` | Admin / DEV | `postagemController.updatePostagem` | Atualiza postagem existente |
| `DELETE` | `/postagens/:id` | Admin / DEV | `postagemController.deletePostagem` | Exclui postagem |
| `POST` | `/postagens/upload` | Admin / DEV | `uploadMiddleware.handleUpload` | Upload multipart (`file`) para `public/uploads`, retorna `{ file_url }` |
| `GET` | `/users/aniversariantes` | Público | `userController.listAniversariantes` | Lista usuários onde `data_nascimento != null` e `show_in_aniversariantes == true` |
| `GET` | `/users` | Admin / DEV | `userController.listAllUsers` | Lista todos os usuários (`id, full_name, email, role`) |
| `PUT` | `/users/:id/role` | Admin / DEV | `userController.updateUserRole` | Altera `role` de um usuário |
| `DELETE` | `/users/:id` | Admin / DEV | `userController.deleteUser` | Exclui um usuário |

---

## 2. Inventário de Funcionalidades (Código Real vs. Relatório de Extensão)

A análise cruzada entre o código-fonte do repositório GitHub e o Relatório de Extensão Universitária revelou com exatidão o estado de cada módulo:

### A. O que já funciona (Implementado no Repositório + Integrado ao Backend)
1. **Autenticação JWT & Registro (`AuthForm.jsx`, `User.js`, `/auth/*`)**:
   - Login com email e senha, persistência de token e verificação de sessão via `/auth/me`.
   - Registro de conta com Nome Completo, Email, Data de Nascimento, Senha e chave de privacidade (`show_in_aniversariantes`: *"Exibir no mural de aniversariantes?"*).
2. **Início / Home (`Home.jsx`)**:
   - Hero institucional IBPJ, card de horário de culto (Todos os dias das 18h00 às 20h00), cartões de Acesso Rápido e versículo bíblico (Mateus 18:20).
3. **Eventos e Calendário (`Eventos.jsx`, `EventoCard.jsx`, `EventoForm.jsx`, `Evento.js`)**:
   - Calendário mensal interativo (`react-day-picker`), filtro de eventos do dia selecionado e do mês corrente, categorização por tipo com badges coloridas e CRUD administrativo conectado à API `/eventos`.
4. **Aniversariantes do Mês (`Aniversarios.jsx`, `User.js`)**:
   - Consome `GET /users/aniversariantes` (respeitando `show_in_aniversariantes = true`), filtra pelo mês atual no fuso local (`parseDateAsLocal`), ordena cronologicamente por dia e destaca os aniversariantes do dia (`Hoje!`).
5. **Programação da Igreja (`Programacao.jsx`, `PostagemCard.jsx`, `PostagemForm.jsx`, `Postagem.js`, `Core.js`)**:
   - Listagem dividida entre postagens "Em Destaque" (`destaque = true`) e "Todas as Postagens", além de CRUD administrativo com upload de imagem (`POST /postagens/upload`).
6. **Princípios, Missão, Visão e Valores (`Principios.jsx`)**:
   - Seções institucionais completas com os 6 Princípios Batistas (e referências bíblicas), Missão, Visão e 6 Valores da IBPJ.
7. **Quem Somos (`QuemSomos.jsx`)**:
   - História da IBPJ, os 4 pilares ("O Que Nos Define": Ensino Bíblico, Amor e Comunhão, Serviço Cristão, Adoração) e chamada para visitação.
8. **Painel de Desenvolvedor / Administração (`DebugPanel.jsx`)**:
   - Listagem de usuários, alteração de roles (`DESENVOLVEDOR`, `admin`, `member`), exclusão de usuários e exclusão rápida de eventos e postagens com modal de confirmação (`AlertDialog`).

### B. O que funciona parcialmente (Possui bugs ou lacunas na implementação atual)
1. **Contato e Localização (`Contato.jsx`)**:
   - Possui endereço real (`Rua Walderez Perez Xavier Giorgi, Parque Jandaia`), coordenadas reais no Google Maps Street View (`-23.5583706, -46.8261038`) e horário de culto (`18h00 - 20h00`).
   - Porém, os links de Facebook (`href="URL_DO_SEU_FACEBOOK"`) e WhatsApp (`href="URL_DO_SEU_WHATSAPP_API"`) estão com strings literais de placeholder que levam a rotas quebradas ao clicar, e o telefone está como `(21) 99999-9999`.
2. **Momento Generosidade (`Generosidade.jsx`)**:
   - Possui fundamentação bíblica (2 Coríntios 9:7), explicação transparente da destinação das ofertas e layout para QR Code PIX, mas o QR Code está estático no estado `"Aguardando configuração"`.
3. **Permissões Administrativas nas Páginas (`Eventos.jsx` e `Programacao.jsx`)**:
   - No backend (`authMiddleware.js`), tanto `role === 'admin'` quanto `role === 'DESENVOLVEDOR'` têm permissão administrativa.
   - Entretanto, em `Eventos.jsx` (linha 80) e `Programacao.jsx` (linha 65), a verificação foi escrita como `const isAdmin = user?.role === 'admin'`, impedindo que o usuário padrão criado pelo seed (`admin@ibpj.com` com role `DESENVOLVEDOR`) veja os botões de criar/editar/excluir eventos e postagens nas respectivas telas!
4. **Edição via Painel de Desenvolvedor (`DebugPanel.jsx`)**:
   - O botão de editar em `DebugPanel.jsx` redireciona para `/eventos?edit=${id}` e `/programacao?edit=${id}`, mas `Eventos.jsx` e `Programacao.jsx` não leem o query param `?edit=`, tornando o botão de edição do painel inoperante.
5. **Login em Dispositivos Móveis (`Layout.jsx`)**:
   - O botão flutuante "Entrar" possui a classe `hidden lg:flex` (linha 213 de `Layout.jsx`), e o menu lateral mobile (`Sheet`) só exibe informações de conta quando `user` já está autenticado (linha 157). Consequentemente, **em telas mobile é impossível abrir a tela de login** na versão web atual!

### C. O que existe apenas como protótipo no Relatório PDF (Não implementado no GitHub)
Nas páginas 35 a 43 do Relatório de Extensão Universitária (5º Semestre), aparecem trechos ilustrativos de código (`PrayerPanel`, `KidsMinistry`, `GalleryTestimonials`, `SmallGroups`, `VolunteerPage`) que **nunca foram integrados ao repositório GitHub nem possuem tabelas no Prisma ou rotas na API**:
- **Pedidos de Oração**: protótipo estático no PDF com array hardcoded.
- **IBPJ Kids**: protótipo estático no PDF sem arquivos PDF reais no servidor.
- **Galeria e Testemunhos**: protótipo estático no PDF com 9 `div`s cinzas vazias (`bg-slate-300`) e 1 frase estática.
- **Pequenos Grupos e Células**: protótipo estático no PDF com cidades fictícias de outro estado (PR).
- **Voluntariado**: protótipo estático no PDF com 5 áreas ministeriais sem endpoint de inscrição.

> **Diretriz Aplicada:** Conforme determinado nas seções 1, 7 e 15 do Master Prompt, **não inventaremos dados fictícios, depoimentos falsos, fotos falsas ou chaves PIX falsas**. Esses módulos comunitários serão organizados de forma honesta e transparente na experiência mobile (exibindo apenas informações institucionais reais das áreas ministeriais/infantil/grupos/oração e estados vazios/informativos claros onde a configuração ou integração de backend ainda não está cadastrada).

### D. O que está obsoleto ou precisa ser substituído / corrigido
1. **`Front/front-ibpj/package.json` incompleto e com nome inválido**:
   - `"name": "IBPJ - Igreja Batista Parque Jandaia"` viola a especificação do `npm` (contém espaços e letras maiúsculas).
   - As bibliotecas `axios`, `react-router-dom` e `framer-motion` são importadas em quase todos os arquivos de `src/`, mas **não estão declaradas no `package.json` nem no `package-lock.json`**. Sem corrigir isso, `npm install` e `vite build` falham imediatamente.
2. **Arquivos duplicados ou órfãos**:
   - `src/components/shared/Layout.jsx` está vazio (0 bytes).
   - `src/components/shared/LoginForm.jsx` foi substituído por `src/components/shared/AuthForm.jsx` e não é utilizado.
3. **Bug de Fuso Horário (`UTC` vs `America/Sao_Paulo`) em Eventos e Postagens**:
   - O banco retorna datas ISO (`YYYY-MM-DDT00:00:00.000Z`). Em `Eventos.jsx`, `EventoCard.jsx` e `PostagemCard.jsx`, o uso direto de `new Date(evento.data)` converte meia-noite UTC para `21:00` do dia anterior no fuso de Brasília (`UTC-3`), deslocando todos os eventos e postagens em **-1 dia** no calendário e nos cards!
4. **URL de Imagem Relativa em `PostagemCard.jsx` e Hardcoded em `PostagemForm.jsx`**:
   - O backend retorna `file_url: "/uploads/..."`. `PostagemCard.jsx` usa `<img src={postagem.imagem_url} />` sem resolver a URL base da API, quebrando a exibição da imagem fora da origem do backend.
5. **Diálogos nativos bloqueantes (`window.confirm` e `window.location.reload`)**:
   - `Eventos.jsx` e `Programacao.jsx` usam `confirm(...)` nativo do navegador, e `Layout.jsx` usa `window.location.reload()` após login/logout, causando perda de fluidez em WebView Android.

### E. O que pode ser reaproveitado diretamente
- **Todo o Backend (`Back/ibpj-api`)**: Express, Prisma schema, migrações, seed, controllers (`auth`, `eventos`, `postagens`, `users`) e middlewares.
- **Entidades e Camada de Dados (`User.js`, `Evento.js`, `Postagem.js`)**: Podem ser mantidas e aprimoradas com suporte a URL de API dinâmica, tratamento de erros de rede e atualização reativa de sessão.
- **Componentes Base Radix UI / Tailwind CSS**: Dialogs, Switches, Selects, Badges, Calendário (`react-day-picker`) e ícones `lucide-react`.

### F. O que precisa ser adaptado para o ambiente mobile
1. **Arquitetura de Navegação Mobile**:
   - Substituir a barra superior desktop e o menu hambúrguer por um **Header Mobile Contextual** + **Bottom Navigation Fixa** de 5 abas (`Início`, `Eventos`, `Programação`, `Comunidade`, `Mais / Perfil`) com suporte a safe-area Android, gestos e botão físico/gestual "Voltar" do Android (`@capacitor/app`).
2. **Design System "IBPJ Mobile — Premium Glass Experience"**:
   - Evoluir a identidade `#001B30` / `#07152D` / `#D4AF37` / `#B89416` com superfícies translúcidas calibradas, tipografia mobile legível, alvos de toque mínimos de `44x44px` / `48x48px`, bottom sheets para formulários e detalhes, estados de carregamento (skeletons), estados de erro com botão "Tentar novamente" e banner de status de conexão.
3. **Configuração de Rede Android (`localhost` vs `10.0.2.2` / IP configurável)**:
   - No Android, `localhost` refere-se ao próprio smartphone/emulador, não à máquina host. A camada de API (`src/api/core.js`) precisa suportar variáveis de ambiente (`VITE_API_URL`), detecção inteligente de plataforma (Web vs Emulador Android `http://10.0.2.2:4000`) e configuração de endpoint pelo próprio app para facilitar testes em dispositivos físicos na rede local ou servidor de produção.

### G. O que depende de infraestrutura externa
1. **Servidor PostgreSQL e Hospedagem da API Node.js**:
   - A API depende de um banco PostgreSQL ativo (`DATABASE_URL`). Para o ambiente local de desenvolvimento e validação, configuraremos uma instância PostgreSQL real na porta `5432`.
2. **Chave PIX Oficial e Contatos Oficiais de Redes Sociais**:
   - O QR Code PIX e as URLs de redes sociais não estão cadastrados no banco de dados atual; o aplicativo deve tratar esses itens com transparência (exibindo apenas dados reais e permitindo configuração limpa sem inventar chaves financeiras).
3. **Notificações Push (FCM)**:
   - O backend não possui infraestrutura de Firebase Cloud Messaging nem tabela de device tokens. Portanto, conforme a Seção 10 do Master Prompt (*"Notificações push somente deverão ser implementadas se houver infraestrutura real para envio e gerenciamento"*), não instalaremos plugins ociosos de push sem backend correspondente.

---

## 3. Riscos de Migração e Mitigações

| Risco | Impacto | Mitigação Implementada |
|---|---|---|
| `localhost:4000` inacessível dentro do APK Android | Alto (App sem dados) | Configurar `10.0.2.2:4000` como fallback padrão em ambiente nativo Android, habilitar `usesCleartextTraffic="true"` para desenvolvimento HTTP local e permitir configuração dinâmica da URL da API na tela de conexão/perfil. |
| Exposição de dados pessoais de membros | Crítico (Privacidade/LGPD) | Manter filtro estrito `show_in_aniversariantes: true` no backend, exibir apenas nome e dia/mês de aniversário (nunca ano de nascimento ou e-mail público nos cards de aniversariantes) e exigir consentimento explícito em pedidos de oração. |
| Dependências ausentes no `package.json` original (`axios`, `react-router-dom`, `framer-motion`) | Crítico (Build falha) | Declarar e fixar versões compatíveis com React 19 no `package.json` antes da integração com Capacitor. |
| Problemas de fuso horário em datas ISO (`UTC-3`) | Médio (Datas erradas no calendário) | Centralizar utilitário `parseLocalDate()` e `formatLocalDate()` em `src/utils/date.js` e utilizá-lo em todos os módulos (`Eventos`, `Programação`, `Aniversariantes`, `Home`). |
| Teclado virtual cobrindo inputs em formulários mobile | Médio (UX prejudicada) | Configurar `windowSoftInputMode="adjustResize"` no `AndroidManifest.xml` e usar containers roláveis com `padding-bottom` seguro nos formulários e modais. |

---

## 4. Recomendação Tecnológica e Plano de Implementação

### 4.1 Tecnologia Recomendada: **React + Vite + Capacitor (`@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/preferences`, `@capacitor/share`, `@capacitor/status-bar`, `@capacitor/splash-screen`)**
- **Justificativa:** O projeto original já é uma SPA React 19 + Vite + Tailwind CSS + Shadcn UI bem modularizada em entidades (`User`, `Evento`, `Postagem`). Com o Capacitor, reaproveitamos 100% da lógica de negócios, entidades e integração com a API REST, enquanto redesenhamos completamente a camada de experiência do usuário (`Layout`, `Navigation`, `Screens`, `Design System`) para um padrão nativo mobile com geração direta de projeto Android Studio / Gradle e APK de produção assinado.

### 4.2 Plano de Execução em 8 Fases
1. **Fase 1 — Auditoria Técnica (`MOBILE_AUDIT.md`)**: Concluída neste documento.
2. **Fase 2 — Arquitetura Mobile (`MOBILE_ARCHITECTURE.md`)**: Definição detalhada da arquitetura, camadas, roteamento, segurança e integração Android + API.
3. **Fase 3 — Design System (*IBPJ Mobile — Premium Glass Experience*)**: Tokens visuais (`#001B30`, `#07152D`, `#D4AF37`, `#B89416`), superfícies glassmorphism, tipografia, animações, Header Mobile e Bottom Navigation de 5 abas.
4. **Fase 4 — Infraestrutura Mobile (Capacitor + Android)**: Correção do `package.json`, instalação do Capacitor e plugins essenciais, geração do projeto `android/`, criação de ícones e splash screen institucionais IBPJ, configuração de `AndroidManifest.xml` e Gradle.
5. **Fase 5 — Implementação Funcional Mobile**: Redesign completo e adaptação para toque de todos os módulos (`Home`, `Eventos`, `Programação`, `Aniversariantes`, `Generosidade`, `Princípios`, `Quem Somos`, `Contato` e hub `Comunidade` com `Ministérios/Voluntariado`, `Pequenos Grupos`, `IBPJ Kids`, `Pedidos de Oração` e `Galeria/Testemunhos`).
6. **Fase 6 — Autenticação, Segurança e Administração Mobile**: Armazenamento seguro de sessão/token (`@capacitor/preferences` com fallback web), fluxo mobile de Login/Cadastro, correção de permissões (`admin` e `DESENVOLVEDOR`) e Painel Administrativo Mobile completo (CRUD de Eventos, Postagens com upload e Gestão de Usuários).
7. **Fase 7 — Testes Integrados (Backend + Frontend + Mobile)**: Inicialização do PostgreSQL e da API `ibpj-api`, execução de testes de ponta a ponta da API, autenticação, CRUD e interface mobile.
8. **Fase 8 — Build Android de Produção (`.apk`)**: Compilação e assinatura do APK de produção via Gradle (`assembleRelease` / `assembleDebug`), verificação de integridade do APK gerado e documentação final.

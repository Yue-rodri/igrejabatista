# IBPJ - Igreja Batista Parque Jandaia (Sistema de Conteúdo)

Este é o projeto full stack para o sistema de gerenciamento de conteúdo (CMS) e visualização do site da IBPJ.

O projeto é dividido em duas partes principais:
* **Backend (`Back/ibpj-api`):** Uma API RESTful construída com Node.js, Express e Prisma para gerenciar o banco de dados PostgreSQL.
* **Frontend (`Front/front-ibpj`):** Uma aplicação moderna em React (Vite) com Tailwind CSS e Shadcn UI para a interface do usuário.

---

## 🚀 Rodando o Projeto Localmente

Para testar este projeto, você precisará executar o **Backend** e o **Frontend** simultaneamente em dois terminais separados.

### Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:
* [Node.js](https://nodejs.org/) (versão 18 ou 20+ recomendada)
* [Git](https://git-scm.com/)
* Um servidor **PostgreSQL** rodando localmente.

---

### 1. Configurando o Backend (API)

O backend é responsável por conectar ao banco de dados e fornecer os dados para o frontend.

**1. Navegue até a pasta da API:**
```bash
cd Back/ibpj-api
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure o Banco de Dados (.env): Crie um arquivo chamado .env na raiz da pasta ibpj-api/. Copie o conteúdo abaixo e altere a DATABASE_URL com suas credenciais locais do PostgreSQL.**

**Importante:** *O banco de dados (igreja_db no exemplo) deve ser criado manualmente no seu PostgreSQL antes de continuar.*

```bash
# String de conexão do PostgreSQL
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
DATABASE_URL="postgresql://postgres:sua_senha_aqui@localhost:5432/igreja_db"
```

**Chave secreta para os tokens de autenticação:**
```bash
JWT_SECRET="chave_secreta_super_forte_pode_ser_qualquer_coisa"
```

**4. Execute as Migrações do Banco: Este comando irá criar todas as tabelas (User, Evento, Postagem) no seu banco de dados PostgreSQL.**
```bash
npm run db:migrate
```

**5. Popule o Banco de Dados (Seed): Este comando criará o usuário DESENVOLVEDOR padrão para que você possa logar.**
```bash
npm run seed
```

**6. Inicie o Servidor da API:**
```bash
npm run dev
```

***"✅ Sucesso! O terminal deve mostrar: 🚀 Servidor rodando em http://localhost:4000."***

---

### 2. Configurando o Frontend (Interface)

Em um segundo terminal, configure e inicie a interface do usuário.

**1. Navegue até a pasta do Frontend:**
```bash
# (Assumindo que você está na raiz do YureProject)
cd Front/front-ibpj
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Inicie o Servidor Vite:**
```bash
npm run dev
```

***✅ Sucesso! A aplicação estará acessível no seu navegador em http://localhost:5173.***

---

## 🔑 Acesso Padrão

Após executar o npm run seed no backend, você pode acessar o sistema com as seguintes credenciais:

    Email: admin@ibpj.com

    Senha: adminpassword123

Este usuário tem a role **DESENVOLVEDOR**, que habilita o painel de debug flutuante para gerenciamento total do site.

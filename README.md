# Job Board

## [Made with nextjs](https://nextjs.org/)

This is a job board where you can register as a employer to post vacancies or as a job seeker looking for vacancies.

**Instructions:** install `npm install` then run `npm run dev` from console.

### Tech Stack:

* Font Awesome
* NextJS - Server Side Rendering (React)
* React Hooks
* Next-Connect
* Bcrypt
* Isomorphic Unfetch
* JSONWebToken (JWT)
* MariaDB
* Memcached
* Sequelize
* Styled Components

## Desktop 
![alt text](/scrnsht1.png "Desktop")

## Profile Page
![alt text](/scrnsht3.png "Profile Page")

## Mobile
![alt text](/scrnsht2.png "Mobile")

### About

This project is a server-side rendered job-board that runs nextjs on the front and back end, single server that connects to a MariaDB database. Authentication and Authorization is done using a JWTs (Refresh and Access tokens).

### Todo

* Use persistent store manage sessions
* Add Settings page for users
* Add Resume Upload
* Add Resume Search
* Browse Companies
* Forget Password System
* Email Verification
# Site do Trabalhador

Uma plataforma moderna para conectar trabalhadores a oportunidades de emprego e orientação sobre direitos trabalhistas.

## 🚀 Características

- **Agregação de Vagas**: Coleta automática de vagas de múltiplas fontes
- **Busca Inteligente**: Filtros por cidade, área e tipo de vaga
- **Captura de Leads**: Formulário especializado para orientação trabalhista
- **Design Moderno**: Interface responsiva com tema escuro
- **Atualização Automática**: Vagas atualizadas a cada 30 minutos
- **Conformidade LGPD**: Termos de uso e política de privacidade

## 🛠️ Tecnologias

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: MariaDB com Sequelize
- **Autenticação**: JWT
- **Integração**: Google Sheets API
- **Notificações**: EmailJS

## 📋 Pré-requisitos

- Node.js 14+ 
- NPM ou Yarn
- MariaDB (opcional para desenvolvimento)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/site-do-trabalhador.git
cd site-do-trabalhador
```

2. **Instale as dependências**
```bash
npm install --legacy-peer-deps
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local`:
```env
# Google Sheets Integration
GOOGLE_SHEETS_API_KEY=sua_api_key
GOOGLE_SHEET_ID=seu_sheet_id

# Email Notifications
EMAILJS_SERVICE_ID=seu_service_id
EMAILJS_TEMPLATE_ID=seu_template_id
EMAILJS_USER_ID=seu_user_id

# Database (opcional)
DB_HOST=localhost
DB_NAME=site_trabalhador
DB_USER=root
DB_PASS=sua_senha

# JWT Secret
JWT_SECRET=seu_jwt_secret_aqui
```

4. **Execute o projeto**
```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 📊 Configuração Google Sheets

### Método 1: SheetDB (Mais Fácil)

1. Acesse [SheetDB.io](https://sheetdb.io/)
2. Conecte sua planilha do Google Sheets
3. Copie a URL da API
4. Atualize o arquivo `pages/api/submit-lead.js`

### Método 2: Google Sheets API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Sheets API
4. Crie credenciais (Service Account)
5. Baixe o arquivo JSON das credenciais
6. Compartilhe sua planilha com o email do service account

**Estrutura da Planilha:**

| Timestamp | Nome | WhatsApp | Última Empresa | Status Carteira | Recebeu Direitos | Problemas | Quer Consultoria | Vaga | Empresa |
|-----------|------|----------|----------------|-----------------|-----------------|-----------|------------------|------|---------|

## 📧 Configuração de Email

### EmailJS

1. Crie conta no [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email
3. Crie um template de email
4. Adicione as credenciais no `.env.local`

### Template de Email Sugerido:

```
Novo Lead - Site do Trabalhador

Nome: {{name}}
WhatsApp: {{whatsapp}}
Vaga: {{jobTitle}}
Empresa: {{company}}

Última empresa: {{lastCompany}}
Status carteira: {{workStatus}}
Recebeu direitos: {{receivedRights}}
Problemas relatados: {{workIssues}}
Quer consultoria: {{wantsConsultation}}

Data: {{timestamp}}
```

## 🔐 Configuração de Autenticação

O sistema usa JWT para autenticação. Para configurar:

1. Defina `JWT_SECRET` no `.env.local`
2. Configure os tipos de usuário (user/company)
3. Customize as rotas protegidas conforme necessário

## 🌐 Deploy no Replit

1. Importe o projeto no Replit
2. Configure as variáveis de ambiente no painel Secrets
3. Execute `npm install --legacy-peer-deps`
4. Configure o domínio personalizado
5. Ative o Always On para atualizações automáticas

## 📝 Fontes de Vagas Configuradas

### 1. Codante Jobs API
- **URL**: `https://apis.codante.io/api/job-board/jobs`
- **Tipo**: API REST pública
- **Frequência**: A cada 30 minutos

### 2. Configuração para Outras Fontes

Para adicionar novas fontes de vagas, edite o arquivo `pages/index.js`:

```javascript
// Exemplo de nova fonte
const fetchJobsFromNewSource = async () => {
  try {
    const response = await fetch('URL_DA_API');
    const data = await response.json();
    // Transformar dados para o formato padrão
    return transformedJobs;
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return [];
  }
};
```

## 🎨 Customização

### Cores do Tema

Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores primárias
      },
      dark: {
        // Suas cores escuras
      }
    }
  }
}
```

### Textos e Conteúdo

- **Headline**: `src/components/HeroSection/HeroSection.jsx`
- **Formulário**: `src/components/LeadModal/LeadModal.jsx`
- **Footer**: `src/components/Footer/Footer.jsx`

## 📊 Painel Administrativo (Em Desenvolvimento)

O painel administrativo está em desenvolvimento e incluirá:

- Dashboard de leads recebidos
- Gestão de conteúdo
- Configurações do site
- Relatórios e analytics

## 🔒 Segurança e LGPD

- ✅ Consentimento explícito para coleta de dados
- ✅ Política de privacidade detalhada
- ✅ Termos de uso claros
- ✅ Criptografia de dados sensíveis
- ✅ Logs de auditoria

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Email**: contato@sitedotrabalhador.com.br
- **GitHub Issues**: [Abrir issue](https://github.com/seu-usuario/site-do-trabalhador/issues)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Site do Trabalhador** - Conectando trabalhadores e oportunidades 🚀

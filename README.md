# Sistema de Agendamento MVP

Sistema de agendamento completo com backend Flask e frontend React.

## Estrutura do Projeto

```
agendamento-mvp/
├── backend/          # API Flask (Python)
├── frontend/         # Interface React (JavaScript)
└── README.md         # Este arquivo
```

## Como Executar

### 🚀 Rodar Backend + Frontend Juntos (Recomendado)

**Opção 1: Script Automático (Windows)**
```bash
start-dev.bat
```

**Opção 2: Janelas Separadas (Windows)**
```bash
start-simple.bat
```

**Opção 3: Linha de Comando**
```bash
# Instalar concurrently
npm install

# Instalar dependências de tudo
npm run install:all

# Rodar ambos juntos
npm run dev
```

### 📱 URLs dos Serviços
- **Backend (API)**: http://localhost:5000
- **Frontend (Interface)**: http://localhost:5173

### 🔧 Executar Separadamente

#### Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure suas variáveis
python run.py
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gerenciamento de clientes
- ✅ Gerenciamento de profissionais
- ✅ Gerenciamento de serviços
- ✅ Sistema de agendamentos
- ✅ Interface visual moderna com React
- ✅ API REST com Flask

## Tecnologias

**Backend:**
- Flask (Python)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Autenticação)
- PostgreSQL/SQLite (Banco de dados)

**Frontend:**
- React 18
- Vite (Build tool)
- Tailwind CSS (Estilização)
- Axios (HTTP client)
- React Router (Navegação)
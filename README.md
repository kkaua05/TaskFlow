# 🚀 TaskFlow - Gerenciador de Tarefas Inteligente

![TaskFlow Logo](public/logotask.png)

> **TaskFlow** é um sistema completo e moderno para gerenciamento de tarefas, notas e produtividade pessoal. Construído com **React + TypeScript + Vite** no frontend e **Node.js + Express + PostgreSQL** no backend, oferece uma experiência fluida com visualização de dados interativa, gráficos, kanban board e grafo de conhecimento bidirecional.

---

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🖥️ Preview do Sistema](#️-preview-do-sistema)
- [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
- [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📁 Estrutura de Pastas](#-estrutura-de-pastas)
- [🚀 Como Executar](#-como-executar)
  - [Pré-requisitos](#pré-requisitos)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [🧩 Componentes do Sistema](#-componentes-do-sistema)
  - [📊 Dashboard](#-dashboard)
  - [✅ Completed Tasks](#-completed-tasks)
  - [📈 Analytics](#-analytics)
  - [📅 Calendar](#-calendar)
  - [📝 Notes](#-notes)
  - [🔗 Graph Notes](#-graph-notes)
  - [⚙️ Settings](#️-settings)
- [🔌 API Endpoints](#-api-endpoints)
- [🎨 Temas e Personalização](#-temas-e-personalização)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## ✨ Funcionalidades

### ✅ Gerenciamento de Tarefas
| Funcionalidade | Descrição |
|----------------|-----------|
| **CRUD Completo** | Criar, editar, duplicar e excluir tarefas |
| **Kanban Board** | Arraste e solte tarefas entre colunas (Pendente → Em andamento → Concluído) |
| **Prioridades** | Classifique tarefas como Baixa, Média, Alta ou Urgente |
| **Categorias** | Organize por Trabalho, Estudos, Pessoal, Financeiro, Saúde, Projetos |
| **Filtros** | Busque tarefas por título, filtre por status e categoria |
| **Metas Diárias** | Acompanhe metas de produtividade diária, semanal e mensal |

### 📝 Notas e Graph Notes
| Funcionalidade | Descrição |
|----------------|-----------|
| **Notas Markdown** | Criação de notas com suporte a Markdown |
| **Grafo Interativo** | Visualização das notas em grafo de força com D3.js |
| **Links Bidirecionais** | Conecte notas usando `[[Título da Nota]]` |
| **Tags e Cores** | Organize notas com tags e cores personalizadas |
| **Favoritos** | Marque notas favoritas para acesso rápido |
| **Exportação** | Exporte todas as notas em JSON |
| **Zoom e Drag** | Arraste nós, zoom com scroll, reset de visualização |

### 📊 Analytics e Estatísticas
- **Gráficos de pizza**: Distribuição por prioridade e categoria
- **Gráfico de barras**: Tarefas completadas por dia (últimos 30 dias)
- **Gráfico de linha (Radar)**: Performance por categoria
- **Cards de métricas**: Total, concluídas, pendentes, atrasadas
- **Taxa de conclusão**: Porcentagem geral de tarefas finalizadas

### 📅 Calendário Integrado
- **Calendário interativo** com react-calendar
- **Destaque visual** para dias com tarefas
- **Filtro por dia** para visualizar tarefas específicas
- **Visualização completa** de tarefas de cada data

### 🎨 Temas
- **Tema escuro** e **claro**
- **Design Glassmorphism** com efeitos de vidro e blur
- **Animações suaves** com Framer Motion
- **Cores vibrantes** com gradientes personalizados

---

## 🖥️ Preview do Sistema

### 📊 Dashboard
> Página inicial com métricas e tarefas pendentes
<p align="center">
  <img src="screenshots/dashboard.jpeg" alt="Dashboard" width="800"/>
</p>

### ✅ Completed Tasks
> Lista de tarefas concluídas com opções de reabrir ou excluir
<p align="center">
  <img src="screenshots/completed-tasks.jpeg" alt="Completed Tasks" width="800"/>
</p>

### 📈 Analytics
> Gráficos e estatísticas detalhadas de produtividade
<p align="center">
  <img src="screenshots/analytics.jpeg" alt="Analytics" width="800"/>
</p>

### 📅 Calendar
> Calendário interativo com tarefas por data
<p align="center">
  <img src="screenshots/calendar.jpeg" alt="Calendar" width="800"/>
</p>

### 📝 Notes
> Gerenciamento de notas com Markdown
<p align="center">
  <img src="screenshots/notes.jpeg" alt="Notes" width="800"/>
</p>

### 🔗 Graph Notes
> Grafo interativo de notas com conexões bidirecionais
<p align="center">
  <img src="screenshots/graph-notes.jpeg" alt="Graph Notes" width="800"/>
</p>

### ⚙️ Settings
> Configurações do sistema e personalização
<p align="center">
  <img src="screenshots/settings.jpeg" alt="Settings" width="800"/>
</p>

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite)                       │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │   React   │  │TypeScript│  │     Context API      │  │
│  │ 18.x      │  │ 5.x      │  │ (Estado Global)      │  │
│  └───────────┘  └──────────┘  └──────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Componentes                                     │   │
│  │  Header | Sidebar | KanbanBoard | TaskCard      │   │
│  │  NoteCard | ForceGraph | Charts | Statistics    │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│                    BACKEND (Express)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Rotas /api/tasks, /api/graph-notes, /api/stats  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware: Autenticação JWT, CORS, JSON        │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ PostgreSQL
┌──────────────────────▼──────────────────────────────────┐
│              BANCO DE DADOS (PostgreSQL)                 │
│  ┌───────────────────┐  ┌───────────────────────────┐   │
│  │    tasks          │  │      graph_notes          │   │
│  └───────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário interage** com a interface React
2. **Context API** gerencia estado global (tarefas, notas, tema)
3. **Serviços (api.ts)** fazem requisições HTTP ao backend
4. **Express** processa as rotas e consulta o PostgreSQL
5. **Banco de dados** retorna os dados
6. **Resposta** percorre o caminho inverso até a UI

---

## ⚙️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React** | 18.2.0 | Biblioteca UI |
| **TypeScript** | 5.2.2 | Tipagem estática |
| **Vite** | 5.2.0 | Build tool e dev server |
| **Framer Motion** | 11.18.2 | Animações |
| **D3.js** | 7.9.0 | Visualização do grafo de notas |
| **Recharts** | 2.12.7 | Gráficos e analytics |
| **@dnd-kit** | 6.1.0 | Drag and drop no Kanban |
| **Lucide React** | 0.378.0 | Ícones |
| **React Icons** | 5.6.0 | Ícones FontAwesome |
| **React Calendar** | 5.0.0 | Calendário |
| **React Markdown** | 10.1.0 | Renderização Markdown |
| **React Hot Toast** | 2.6.0 | Notificações toast |
| **date-fns** | 3.6.0 | Manipulação de datas |

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Node.js** | - | Runtime |
| **Express** | 5.2.1 | Framework HTTP |
| **PostgreSQL (pg)** | 8.21.0 | Driver do banco |
| **CORS** | 2.8.6 | Middleware CORS |
| **dotenv** | 17.4.2 | Variáveis de ambiente |
| **bcryptjs** | 3.0.3 | Hash de senhas |
| **jsonwebtoken** | 9.0.3 | Autenticação JWT |
| **nodemon** | 3.1.14 | Hot reload no desenvolvimento |

---

## 📁 Estrutura de Pastas

```
taskflow/
│
├── 📂 public/                    # Assets públicos estáticos
│   ├── favicon.svg               # Ícone do site (aba do navegador)
│   ├── icons.svg                 # Ícones SVG do sistema
│   └── logotask.png              # Logo principal do TaskFlow
│
├── 📂 screenshots/               # Screenshots do sistema
│   ├── dashboard.jpeg            # Dashboard
│   ├── completed-tasks.jpeg      # Tarefas concluídas
│   ├── analytics.jpeg            # Analytics e gráficos
│   ├── calendar.jpeg             # Calendário
│   ├── notes.jpeg                # Notas
│   ├── graph-notes.jpeg          # Grafo de notas
│   └── settings.jpeg             # Configurações
│
├── 📂 src/                       # Código fonte do frontend
│   ├── 📂 assets/                # Recursos de mídia
│   │   ├── hero.png              # Imagem hero (fundo/destaque)
│   │   ├── react.svg             # Logo React
│   │   └── vite.svg              # Logo Vite
│   │
│   ├── 📂 components/            # Componentes React reutilizáveis
│   │   ├── 📂 Charts/            # Gráficos e analytics
│   │   ├── 📂 ForceGraph/        # Grafo de notas interativo D3.js
│   │   ├── 📂 Header/            # Cabeçalho principal
│   │   ├── 📂 KanbanBoard/       # Quadro Kanban com drag-and-drop
│   │   ├── 📂 Notes/             # Cards e modal de notas
│   │   ├── 📂 Sidebar/           # Navegação lateral
│   │   ├── 📂 StatisticsCards/   # Cards de métricas
│   │   ├── 📂 TaskCard/          # Card de tarefa individual
│   │   └── 📂 TaskModal/         # Modal de criação/edição de tarefa
│   │
│   ├── 📂 contexts/              # Context API (estado global)
│   │   ├── GraphNotesContext.tsx  # Estado das notas do grafo
│   │   ├── NoteContext.tsx        # Estado das notas comuns
│   │   ├── TaskContext.tsx        # Estado das tarefas
│   │   └── ThemeContext.tsx       # Tema claro/escuro
│   │
│   ├── 📂 hooks/                 # Hooks personalizados
│   │   ├── useLocalStorage.ts    # Persistência no localStorage
│   │   └── useTheme.ts           # Gerenciamento de tema
│   │
│   ├── 📂 pages/                 # Páginas do sistema
│   │   ├── Dashboard.tsx         # Página inicial com tarefas
│   │   ├── CompletedTasks.tsx    # Tarefas concluídas
│   │   ├── Analytics.tsx         # Estatísticas e gráficos
│   │   ├── Calendar.tsx          # Calendário de tarefas
│   │   ├── Notes.tsx             # Gerenciamento de notas
│   │   ├── GraphNotes.tsx        # Grafo interativo de notas
│   │   └── Settings.tsx          # Configurações do sistema
│   │
│   ├── 📂 services/              # Serviços de API
│   │   ├── api.ts                # Cliente HTTP (axios/fetch)
│   │   └── storageService.ts     # Armazenamento local
│   │
│   ├── 📂 styles/                # Estilos globais
│   │   └── global.css            # CSS com variáveis de tema
│   │
│   ├── 📂 types/                 # Tipos TypeScript
│   │   └── index.ts              # Interfaces e tipos do sistema
│   │
│   ├── App.tsx                   # Componente raiz com roteamento
│   ├── App.css                   # Estilos do App
│   ├── index.css                 # Estilos base
│   ├── main.tsx                  # Entry point React
│   └── types.ts                  # Tipos adicionais
│
├── 📂 backend/                   # Servidor backend
│   ├── 📂 config/                # Configurações
│   │   └── database.js           # Conexão com PostgreSQL
│   ├── 📂 middleware/            # Middleware Express
│   │   └── auth.js               # Autenticação JWT
│   ├── 📂 models/                # Models do banco
│   │   ├── GraphNote.js          # Model de notas do grafo
│   │   └── Task.js               # Model de tarefas
│   ├── 📂 routes/                # Rotas da API
│   │   ├── graph-notes.js        # CRUD de notas do grafo
│   │   ├── notes.js              # CRUD de notas comuns
│   │   └── tasks.js              # CRUD de tarefas
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json              # Dependências do backend
│   ├── server.js                 # Servidor Express principal
│   └── test-db.js                # Script de teste de conexão
│
├── .gitignore                    # Arquivos ignorados pelo Git
├── eslint.config.js              # Configuração ESLint
├── index.html                    # HTML entry point
├── package.json                  # Dependências do frontend
├── tsconfig.json                 # Config TypeScript principal
├── tsconfig.app.json             # Config TypeScript app
├── tsconfig.node.json            # Config TypeScript Node
└── vite.config.ts                # Configuração do Vite
```

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **npm** ou **yarn**

### Frontend

```bash
# 1. Clone o repositório
git clone https://github.com/kkaua05/TaskFlow.git
cd taskflow

# 2. Instale as dependências
npm install

# 3. Execute em modo desenvolvimento
npm run dev

# O servidor frontend será iniciado em:
# http://localhost:5173
```

### Backend

```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Edite o arquivo .env com suas credenciais do PostgreSQL:
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/taskflow
# PORT=5000
# JWT_SECRET=seu_segredo_aqui

# 4. Execute o servidor com nodemon (recomendado)
npm run dev

# Ou execute diretamente
node server.js

# O servidor backend será iniciado em:
# http://localhost:5000
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila TypeScript e gera build de produção |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa ESLint no código |

---

## 🗄️ Banco de Dados

### Tabela: `tasks`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `SERIAL PRIMARY KEY` | Identificador único |
| `title` | `VARCHAR(255) NOT NULL` | Título da tarefa |
| `description` | `TEXT` | Descrição detalhada |
| `category` | `VARCHAR(100)` | Categoria (work, studies, etc.) |
| `priority` | `VARCHAR(50)` | Prioridade (low, medium, high, urgent) |
| `status` | `VARCHAR(50)` | Status (pending, in-progress, completed, cancelled) |
| `color` | `VARCHAR(20)` | Cor personalizada |
| `due_date` | `TIMESTAMP` | Data de vencimento |
| `tags` | `TEXT[]` | Array de tags |
| `created_at` | `TIMESTAMP` | Data de criação |
| `updated_at` | `TIMESTAMP` | Data de atualização |

### Tabela: `graph_notes`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `SERIAL PRIMARY KEY` | Identificador único |
| `title` | `VARCHAR(255) NOT NULL` | Título da nota |
| `content` | `TEXT` | Conteúdo em Markdown |
| `color` | `VARCHAR(20)` | Cor personalizada |
| `tags` | `TEXT[]` | Array de tags |
| `links` | `TEXT[]` | IDs das notas conectadas |
| `is_favorite` | `BOOLEAN` | Indicador de favorito |
| `created_at` | `TIMESTAMP` | Data de criação |
| `updated_at` | `TIMESTAMP` | Data de atualização |

### Diagrama de Relacionamento

```
┌──────────────────┐        ┌─────────────────────┐
│      tasks       │        │    graph_notes      │
├──────────────────┤        ├─────────────────────┤
│ id (PK)          │        │ id (PK)             │
│ title            │        │ title               │
│ description      │        │ content (Markdown)  │
│ category         │        │ color               │
│ priority         │        │ tags (TEXT[])       │
│ status           │        │ links (TEXT[]) ──────┼─── Auto-referência
│ color            │        │ is_favorite         │
│ due_date         │        │ created_at          │
│ tags (TEXT[])    │        │ updated_at          │
│ created_at       │        └─────────────────────┘
│ updated_at       │
└──────────────────┘
```

> **Nota:** As notas do grafo se auto-referenciam através da coluna `links`, que armazena um array de IDs de outras notas. Links são criados automaticamente quando o conteúdo contém `[[Título de Outra Nota]]`.

---

## 🧩 Componentes do Sistema

### 📊 Dashboard

> Página principal com visão geral das tarefas, métricas e acesso rápido

| Componente | Descrição |
|------------|-----------|
| **Header** | Campo de busca global e botão "Nova Tarefa" |
| **StatisticsCards** | Exibe métricas: Total, Concluídas, Pendentes e Atrasadas |
| **Lista de Tarefas** | Cards das tarefas pendentes (limite de 10) com cores por prioridade |
| **TaskModal** | Modal completo para criar/editar tarefas com todos os campos |
| **Animações** | Transições suaves com Framer Motion (fade in) |

**Funcionalidades:**
- Criar, editar, duplicar e excluir tarefas diretamente do dashboard
- Busca por título em tempo real
- Marcar tarefas como concluídas com um clique
- Cards coloridos por nível de prioridade

---

### ✅ Completed Tasks

> Visualização de todas as tarefas que foram concluídas

| Funcionalidade | Descrição |
|----------------|-----------|
| **Listagem** | Exibe todas as tarefas com status "completed" |
| **Reabrir** | Opção de reabrir uma tarefa concluída (volta para "pending") |
| **Excluir** | Remove tarefa permanentemente |
| **Voltar** | Navegação de volta ao Dashboard |

---

### 📈 Analytics

> Estatísticas detalhadas e gráficos para análise de produtividade

| Componente | Descrição |
|------------|-----------|
| **Pizza Chart (Prioridade)** | Distribuição de tarefas por prioridade (Baixa, Média, Alta, Urgente) |
| **Pizza Chart (Categoria)** | Distribuição de tarefas por categoria (Trabalho, Estudos, etc.) |
| **Bar Chart** | Tarefas completadas por dia nos últimos 30 dias |
| **Radar Chart** | Performance por categoria (visão multidimensional) |
| **Stats Cards** | KPIs: total de tarefas, concluídas, pendentes, atrasadas, taxa de conclusão |

---

### 📅 Calendar

> Calendário interativo para visualização de tarefas por data

| Funcionalidade | Descrição |
|----------------|-----------|
| **Calendário** | Navegação mensal com react-calendar |
| **Destaque** | Dias com tarefas são destacados visualmente |
| **Filtro** | Clique em um dia para ver as tarefas daquela data |
| **Lista** | Tarefas exibidas com detalhes (título, prioridade, status) |
| **Controles** | Filtro por status (todas, pendentes, concluídas) |

---

### 📝 Notes

> Sistema de notas com suporte a Markdown

| Funcionalidade | Descrição |
|----------------|-----------|
| **Grid de Notas** | Cards estilizados com cores personalizadas |
| **Markdown** | Suporte completo a formatação Markdown |
| **Cores** | Cada nota pode ter uma cor de destaque |
| **Ícones** | Ícones personalizados por categoria/tipo |
| **Modal** | Criação e edição em modal dedicado |

---

### 🔗 Graph Notes

> Visualização de conhecimento em grafo interativo com D3.js

| Funcionalidade | Descrição |
|----------------|-----------|
| **Grafo de Força** | Visualização em grafo com simulação de força (D3 force layout) |
| **Nós** | Cada nota é representada por um círculo colorido com ícone |
| **Arestas** | Conexões entre notas representadas por linhas curvadas com gradiente |
| **Links Bidirecionais** | Conexão automática usando `[[Título da Nota]]` no conteúdo |
| **Interatividade** | Arrastar nós livremente, zoom com scroll, hover com destaque e brilho |
| **Busca** | Filtro por título, conteúdo ou tags |
| **Exportação** | Exporta todas as notas e conexões em JSON |
| **Controles** | Mostrar/esconder grafo, resetar visão, recarregar simulação |
| **Painel de Ajuda** | Dicas de uso com exemplo de sintaxe de links |

---

### ⚙️ Settings

> Configurações do sistema e preferências do usuário

| Funcionalidade | Descrição |
|----------------|-----------|
| **Tema** | Alternar entre tema claro e escuro |
| **Notificações** | Ativar/desativar notificações do sistema |
| **View Padrão** | Escolher visualização padrão (Lista, Kanban, Calendário) |
| **Persistência** | Configurações salvas automaticamente no localStorage |

---

## 🔌 API Endpoints

### Tarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/tasks` | Lista todas as tarefas |
| `POST` | `/api/tasks` | Cria nova tarefa |
| `PUT` | `/api/tasks/:id` | Atualiza tarefa existente |
| `DELETE` | `/api/tasks/:id` | Remove tarefa |
| `GET` | `/api/stats` | Estatísticas das tarefas |

### Graph Notes

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/graph-notes` | Lista todas as notas |
| `POST` | `/api/graph-notes` | Cria nova nota |
| `PUT` | `/api/graph-notes/:id` | Atualiza nota existente |
| `DELETE` | `/api/graph-notes/:id` | Remove nota |

### Exemplo de Requisição

```json
// POST /api/tasks
{
  "title": "Implementar autenticação",
  "description": "Adicionar JWT no backend",
  "category": "projects",
  "priority": "high",
  "status": "pending",
  "color": "#EF4444",
  "due_date": "2026-07-01T00:00:00Z",
  "tags": ["backend", "segurança"]
}
```

---

## 🎨 Temas e Personalização

### Variáveis CSS (Tema Escuro - Padrão)

```css
--bg-primary: #0f0f1a;       /* Fundo principal escuro */
--bg-secondary: #1a1a2e;     /* Fundo secundário */
--bg-tertiary: #16213e;      /* Fundo terciário */
--text-primary: #e2e8f0;     /* Texto principal claro */
--text-secondary: #94a3b8;   /* Texto secundário */
--glass-bg: rgba(255,255,255,0.05);  /* Efeito vidro */
--glass-border: rgba(255,255,255,0.1);
```

### Tema Claro
O sistema alterna automaticamente as variáveis CSS para tons claros quando o tema é alterado nas configurações.

### Personalização
- **Cores**: Cada tarefa e nota pode ter uma cor personalizada
- **Tags**: Sistema flexível de tags para organização
- **Categorias**: 6 categorias pré-definidas + categorias customizadas

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature: `git checkout -b feature/nova-feature`
3. **Commit** suas mudanças: `git commit -m "Descrição clara do que foi feito"`
4. **Push** para a branch: `git push origin feature/nova-feature`
5. **Abra um Pull Request**

### Padrões de Código
- Use TypeScript estrito para tipagem
- Siga o padrão de Context API para estado global
- Mantenha componentes React puros e reutilizáveis
- Utilize Framer Motion para animações

---

## 📄 Licença

Este projeto é privado e de uso pessoal/acadêmico.

---

## 👨‍💻 Autor

Desenvolvido por **kkaua05** - [GitHub](https://github.com/kkaua05)

---

<p align="center">
  <strong>TaskFlow</strong> - Transformando ideias em fluxo de trabalho 🚀
</p>

<p align="center">
  <img src="public/logotask.png" alt="TaskFlow" width="100"/>
</p>
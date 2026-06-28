/*
 * =============================================================================
 * TaskFlow - App Component (Root Component)
 * =============================================================================
 *
 * Arquivo: src/App.tsx
 * Descrição: Componente raiz da aplicação. Orquestra toda a árvore de
 *            componentes, provedores de contexto (ThemeProvider, TaskProvider,
 *            GraphNotesProvider) e o sistema de roteamento interno via estado.
 *            Gerencia a página ativa e o estado da sidebar. Renderiza o Toaster
 *            para notificações toast em toda a aplicação.
 *
 * Fluxo: App -> Providers -> Sidebar + Main Content (Páginas dinâmicas)
 *
 * Tecnologias: React 18, Context API, react-hot-toast, Framer Motion
 * =============================================================================
 */
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { GraphNotesProvider } from './contexts/GraphNotesContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import type { PageType } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CompletedTasks } from './pages/CompletedTasks';
import { Analytics } from './pages/Analytics';
import { Calendar } from './pages/Calendar';
import { Notes } from './pages/Notes';
import { GraphNotes } from './pages/GraphNotes';
import { Settings } from './pages/Settings';
import './styles/global.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'completed':
        return <CompletedTasks onBack={() => setCurrentPage('dashboard')} />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <Notes />;
      case 'graph-notes':
        return <GraphNotes />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        padding: '1rem',
        overflowX: 'hidden'
      }}>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <GraphNotesProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)'
              }
            }}
          />
          <AppContent />
        </GraphNotesProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
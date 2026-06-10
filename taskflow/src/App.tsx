import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import type { PageType } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CompletedTasks } from './pages/CompletedTasks';
import { Analytics } from './pages/Analytics';
import { Calendar } from './pages/Calendar';
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
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;

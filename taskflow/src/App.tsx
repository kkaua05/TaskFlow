import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { Dashboard } from './pages/Dashboard';
import './styles/global.css';

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
        <Dashboard />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
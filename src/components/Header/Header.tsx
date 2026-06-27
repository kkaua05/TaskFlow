import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaMoon, FaSun } from 'react-icons/fa';
import { useThemeContext } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  onNewTask: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTask, onSearch }) => {
  const { theme, toggleTheme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();
  const hour = currentDate.getHours();
  
  let greeting = '';
  if (hour < 12) greeting = 'Bom dia';
  else if (hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="glass"
      style={{
        padding: '1rem 2rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span role="img" aria-label="greeting">
            {hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙'}
          </span>
          {greeting}! Hoje é {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        alignItems: 'center', 
        flex: '1', 
        maxWidth: '500px',
        minWidth: '250px'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FaSearch 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }} 
          />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4F46E5';
              e.target.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '0.75rem',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        >
          {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewTask}
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}
        >
          <FaPlus size={14} /> Nova Tarefa
        </motion.button>
      </div>
    </motion.header>
  );
};
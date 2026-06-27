import { motion } from 'framer-motion';
import { FaSave, FaMoon, FaSun, FaBell, FaPalette, FaDatabase } from 'react-icons/fa';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();
  const [notifications, setNotifications] = useLocalStorage<boolean>('notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage<boolean>('autoSave', true);
  const [defaultView, setDefaultView] = useLocalStorage<string>('defaultView', 'list');

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
      localStorage.clear();
      toast.success('Dados limpos! A página será recarregada.');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const settingsSections = [
    {
      title: 'Aparência',
      icon: <FaPalette />,
      items: [
        {
          label: 'Tema',
          description: 'Escolha entre tema claro ou escuro',
          control: (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              {theme === 'dark' ? 'Claro' : 'Escuro'}
            </motion.button>
          )
        }
      ]
    },
    {
      title: 'Preferências',
      icon: <FaBell />,
      items: [
        {
          label: 'Notificações',
          description: 'Receber notificações do sistema',
          control: (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>{notifications ? 'Ativado' : 'Desativado'}</span>
            </label>
          )
        },
        {
          label: 'Auto Save',
          description: 'Salvar tarefas automaticamente',
          control: (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>{autoSave ? 'Ativado' : 'Desativado'}</span>
            </label>
          )
        },
        {
          label: 'Visualização Padrão',
          description: 'Página inicial ao abrir o sistema',
          control: (
            <select
              value={defaultView}
              onChange={(e) => setDefaultView(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--text-primary)'
              }}
            >
              <option value="list">Lista</option>
              <option value="kanban">Kanban</option>
              <option value="calendar">Calendário</option>
            </select>
          )
        }
      ]
    },
    {
      title: 'Dados',
      icon: <FaDatabase />,
      items: [
        {
          label: 'Limpar Dados',
          description: 'Remover todas as tarefas e configurações',
          control: (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearData}
              style={{
                background: '#EF4444',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              Limpar Tudo
            </motion.button>
          )
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem' }}
    >
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Configurações
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Personalize sua experiência no TaskFlow
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          style={{
            background: 'linear-gradient(135deg, #10B981, #34D399)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <FaSave /> Salvar Configurações
        </motion.button>
      </div>

      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="glass"
          style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.25rem', color: '#8B5CF6' }}>{section.icon}</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{section.title}</h2>
          </div>
          
          {section.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: itemIndex !== section.items.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <div>
                <h3 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{item.label}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.description}</p>
              </div>
              {item.control}
            </div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};
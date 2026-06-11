import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaCheckCircle, 
  FaChartLine, 
  FaCalendarAlt, 
  FaStickyNote,
  FaCog
} from 'react-icons/fa';

export type PageType = 'dashboard' | 'completed' | 'analytics' | 'calendar' | 'notes' | 'settings';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: JSX.Element;
  description: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onToggle }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome size={20} />, description: 'Visão geral das tarefas' },
    { id: 'completed', label: 'Concluídas', icon: <FaCheckCircle size={20} />, description: 'Tarefas finalizadas' },
    { id: 'analytics', label: 'Analytics', icon: <FaChartLine size={20} />, description: 'Métricas e relatórios' },
    { id: 'calendar', label: 'Calendário', icon: <FaCalendarAlt size={20} />, description: 'Visualização mensal' },
    { id: 'notes', label: 'Notes', icon: <FaStickyNote size={20} />, description: 'Notas e documentos' },
    { id: 'settings', label: 'Configurações', icon: <FaCog size={20} />, description: 'Preferências do sistema' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          zIndex: 999,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          borderRight: '1px solid var(--glass-border)'
        }}
      >
        {/* Logo Section */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
              padding: '12px'
            }}
          >
            <img 
              src="/logotask.png" 
              alt="TaskFlow Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)'
              }}
            />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem'
            }}
          >
            TaskFlow
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.7rem',
              letterSpacing: '0.5px'
            }}
          >
            Organize. Planeje. Realize.
          </motion.p>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.05), duration: 0.3 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onPageChange(item.id);
                if (window.innerWidth <= 768) onToggle();
              }}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                marginBottom: '0.5rem',
                background: currentPage === item.id 
                  ? 'linear-gradient(135deg, #4F46E5, #8B5CF6)'
                  : 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ 
                color: currentPage === item.id ? 'white' : 'var(--text-primary)',
                opacity: currentPage === item.id ? 1 : 0.7
              }}>
                {item.icon}
              </span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ 
                  color: currentPage === item.id ? 'white' : 'var(--text-primary)',
                  fontWeight: currentPage === item.id ? '600' : '500',
                  fontSize: '0.9rem'
                }}>
                  {item.label}
                </div>
                <div style={{ 
                  color: currentPage === item.id ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  marginTop: '0.125rem'
                }}>
                  {item.description}
                </div>
              </div>
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    width: '3px',
                    height: '20px',
                    background: 'white',
                    borderRadius: '2px'
                  }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ 
            marginTop: 'auto', 
            paddingTop: '1rem',
            borderTop: '1px solid var(--glass-border)'
          }}
        >
          <div style={{
            padding: '0.875rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Versão 2.0.0
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              © 2024 TaskFlow
            </p>
          </div>
        </motion.div>
      </motion.aside>

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: isOpen ? '260px' : '1rem',
          background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'left 0.3s ease'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? '◀' : '▶'}
      </motion.button>
    </>
  );
};

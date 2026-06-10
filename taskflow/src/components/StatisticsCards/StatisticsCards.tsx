import { motion } from 'framer-motion';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import type { Task } from '../../types';

interface StatisticsCardsProps {
  tasks: Task[];
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    { title: 'Total Tarefas', value: total, icon: FaTasks, color: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
    { title: 'Concluídas', value: completed, icon: FaCheckCircle, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
    { title: 'Pendentes', value: pending, icon: FaClock, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { title: 'Atrasadas', value: overdue, icon: FaExclamationTriangle, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #F87171)' },
    { title: 'Produtividade', value: `${productivity}%`, icon: FaChartLine, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      padding: '1rem'
    }}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass"
          style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.title}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</h2>
            </div>
            <div style={{
              background: stat.gradient,
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon size={24} color="white" />
            </div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: stat.gradient
          }} />
        </motion.div>
      ))}
    </div>
  );
};
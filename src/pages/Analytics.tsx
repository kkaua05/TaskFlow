import { motion } from 'framer-motion';
import { FaChartLine, FaTrophy, FaBullseye, FaRocket } from 'react-icons/fa';
import { useTasks } from '../contexts/TaskContext';
import { Charts } from '../components/Charts/Charts';

export const Analytics: React.FC = () => {
  const { tasks } = useTasks();

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(1);
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  const stats = [
    { title: 'Taxa de Conclusão', value: `${completionRate}%`, icon: <FaChartLine />, color: '#10B981', description: 'Tarefas finalizadas' },
    { title: 'Tarefas de Alta Prioridade', value: highPriorityTasks, icon: <FaBullseye />, color: '#EF4444', description: 'Prioritárias/Urgentes' },
    { title: 'Tarefas Atrasadas', value: overdueTasks, icon: <FaRocket />, color: '#F59E0B', description: 'Precisam de atenção' },
    { title: 'Total Concluídas', value: completedTasks, icon: <FaTrophy />, color: '#8B5CF6', description: 'Parabéns!' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Métricas detalhadas e relatórios de produtividade
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass"
            style={{ padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', color: stat.color }}>{stat.icon}</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</h2>
            </div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{stat.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{stat.description}</p>
          </motion.div>
        ))}
      </div>

      <Charts tasks={tasks} />
    </motion.div>
  );
};
/*
 * =============================================================================
 * TaskFlow - StatisticsCards Component
 * =============================================================================
 *
 * Arquivo: src/components/StatisticsCards/StatisticsCards.tsx
 * Descrição: Exibe cards de métricas com estatísticas das tarefas: Total,
 *            Concluídas, Pendentes, Atrasadas e Produtividade (porcentagem).
 *            Busca dados da API via taskApi.getStats() e anima a entrada
 *            dos cards com Framer Motion com atraso escalonado.
 *
 * Tecnologias: React, Framer Motion, react-icons, API REST
 * =============================================================================
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { taskApi } from '../../services/api';

export const StatisticsCards: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskApi.getStats().then(data => {
      if (data) setStats(data);
      setLoading(false);
    });
  }, []);

  const productivity = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  const cards = [
    { title: 'Total Tarefas', value: stats.total, icon: FaTasks, gradient: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
    { title: 'Concluídas', value: stats.completed, icon: FaCheckCircle, gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
    { title: 'Pendentes', value: stats.pending, icon: FaClock, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { title: 'Atrasadas', value: stats.overdue, icon: FaExclamationTriangle, gradient: 'linear-gradient(135deg, #EF4444, #F87171)' },
    { title: 'Produtividade', value: `${productivity}%`, icon: FaChartLine, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }
  ];

  if (loading) return <div style={{ padding: '1rem' }}>Carregando...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem' }}>
      {cards.map((card, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{card.title}</p><h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{card.value}</h2></div>
            <div style={{ background: card.gradient, borderRadius: '12px', padding: '0.75rem' }}><card.icon size={24} color="white" /></div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: card.gradient }} />
        </motion.div>
      ))}
    </div>
  );
};
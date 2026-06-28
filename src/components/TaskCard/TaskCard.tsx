/*
 * =============================================================================
 * TaskFlow - TaskCard Component
 * =============================================================================
 *
 * Arquivo: src/components/TaskCard/TaskCard.tsx
 * Descrição: Card individual de tarefa que exibe título, descrição, prioridade
 *            (com cor), categoria, status de atraso e data de vencimento.
 *            Inclui botões de ação: Concluir, Editar, Duplicar e Excluir.
 *            Usa animações Framer Motion para hover e entrada.
 *
 * Props: task, onEdit, onDelete, onDuplicate, onComplete
 * Dependências: PRIORITIES, CATEGORIES (de src/types)
 *
 * Tecnologias: React, Framer Motion, react-icons, date-fns
 * =============================================================================
 */
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaCopy, FaCheck, FaClock } from 'react-icons/fa';
import type { Task } from '../../types';
import { PRIORITIES, CATEGORIES } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onComplete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onDuplicate, onComplete }) => {
  const priority = PRIORITIES[task.priority];
  const category = CATEGORIES.find(c => c.id === task.category);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass"
      style={{
        padding: '1.5rem',
        marginBottom: '1rem',
        borderLeft: `4px solid ${priority.color}`,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{task.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {task.status !== 'completed' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onComplete(task.id)}
              style={{
                background: '#10B981',
                border: 'none',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <FaCheck size={12} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            style={{
              background: '#3B82F6',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <FaEdit size={12} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDuplicate(task.id)}
            style={{
              background: '#8B5CF6',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <FaCopy size={12} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            style={{
              background: '#EF4444',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <FaTrash size={12} />
          </motion.button>
        </div>
      </div>

      {task.description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{
          background: priority.color + '20',
          color: priority.color,
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          {priority.label}
        </span>
        
        {category && (
          <span style={{
            background: category.color + '20',
            color: category.color,
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {category.name}
          </span>
        )}

        {isOverdue && (
          <span style={{
            background: '#EF444420',
            color: '#EF4444',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            Atrasada
          </span>
        )}
      </div>

      {task.dueDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <FaClock size={12} />
          <span>Vence em: {format(new Date(task.dueDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
        </div>
      )}
    </motion.div>
  );
};
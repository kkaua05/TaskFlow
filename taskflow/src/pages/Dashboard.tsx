import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header/Header';
import { StatisticsCards } from '../components/StatisticsCards/StatisticsCards';
import { TaskCard } from '../components/TaskCard/TaskCard';
import { TaskModal } from '../components/TaskModal/TaskModal';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, duplicateTask, completeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar tarefas pendentes
  const pendingTasks = useMemo(() => {
    return tasks.filter(task => task.status !== 'completed');
  }, [tasks]);

  // Filtrar por busca e ordenar
  const filteredTasks = useMemo(() => {
    let filtered = pendingTasks;
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [pendingTasks, searchQuery]);

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task.id, task);
      setEditingTask(undefined);
      toast.success('Tarefa atualizada com sucesso!');
    } else {
      addTask(task);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh' }}
    >
      <Header onNewTask={handleNewTask} onSearch={setSearchQuery} />
      
      <StatisticsCards tasks={tasks} />
      
      <div style={{ padding: '1rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Tarefas Pendentes</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {filteredTasks.length} de {pendingTasks.length} tarefas
              </p>
            </div>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                Limpar busca 🔍
              </motion.button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {filteredTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '3rem 2rem'
                }}
              >
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '1rem',
                  opacity: 0.5
                }}>
                  {searchQuery ? '🔍' : '📋'}
                </div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {searchQuery ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa pendente'}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery 
                    ? `Nenhuma tarefa corresponde a "${searchQuery}"`
                    : 'Clique em "Nova Tarefa" para começar!'
                  }
                </p>
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery('')}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Limpar busca
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onDuplicate={duplicateTask}
                      onComplete={completeTask}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </motion.div>
  );
};

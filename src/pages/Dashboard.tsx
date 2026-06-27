import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header/Header';
import { StatisticsCards } from '../components/StatisticsCards/StatisticsCards';
import { TaskCard } from '../components/TaskCard/TaskCard';
import { TaskModal } from '../components/TaskModal/TaskModal';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';

export const Dashboard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, duplicateTask, completeTask, loading } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(t => t.status !== 'completed').filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);

  const handleSaveTask = async (task: Task) => {
    if (editingTask) { await updateTask(task.id, task); setEditingTask(undefined); }
    else { await addTask(task); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Header onNewTask={() => { setEditingTask(undefined); setIsModalOpen(true); }} onSearch={setSearchQuery} />
      <StatisticsCards />
      <div style={{ padding: '1rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Tarefas Pendentes</h2>
          {filteredTasks.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma tarefa pendente.</p> :
            filteredTasks.map(task => <TaskCard key={task.id} task={task} onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }} onDelete={deleteTask} onDuplicate={duplicateTask} onComplete={completeTask} />)
          }
        </div>
      </div>
      <TaskModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(undefined); }} onSave={handleSaveTask} task={editingTask} />
    </motion.div>
  );
};
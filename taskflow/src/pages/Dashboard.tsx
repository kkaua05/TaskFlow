import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header/Header';
import { StatisticsCards } from '../components/StatisticsCards/StatisticsCards';
import { TaskCard } from '../components/TaskCard/TaskCard';
import { TaskModal } from '../components/TaskModal/TaskModal';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';

export const Dashboard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, duplicateTask, completeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task.id, task);
      setEditingTask(undefined);
    } else {
      addTask(task);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header onNewTask={() => {
        setEditingTask(undefined);
        setIsModalOpen(true);
      }} onSearch={setSearchQuery} />
      
      <StatisticsCards tasks={tasks} />
      
      <div style={{ padding: '1rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Tarefas Recentes</h2>
          {filteredTasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              Nenhuma tarefa encontrada. Clique em "Nova Tarefa" para começar!
            </p>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onDuplicate={duplicateTask}
                onComplete={completeTask}
              />
            ))
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </motion.div>
  );
};
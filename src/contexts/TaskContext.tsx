import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task } from '../types';
import { taskApi } from '../services/api';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  duplicateTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: Task['status']) => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const loadedTasks = await taskApi.getAll();
    setTasks(loadedTasks);
    setLoading(false);
  };

  const addTask = async (task: Task) => {
    const newTask = await taskApi.create(task);
    if (newTask) {
      setTasks([newTask, ...tasks]);
      toast.success('Tarefa criada!');
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    const updated = await taskApi.update(id, updatedTask);
    if (updated) {
      setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
      toast.success('Tarefa atualizada!');
    }
  };

  const deleteTask = async (id: string) => {
    const success = await taskApi.delete(id);
    if (success) {
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Tarefa removida!');
    }
  };

  const duplicateTask = async (id: string) => {
    const original = tasks.find(t => t.id === id);
    if (original) {
      await addTask({ ...original, id: Date.now().toString(), title: `${original.title} (Cópia)`, createdAt: new Date(), status: 'pending' });
    }
  };

  const completeTask = async (id: string) => updateTask(id, { status: 'completed' });
  const moveTask = async (id: string, newStatus: Task['status']) => updateTask(id, { status: newStatus });

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, duplicateTask, completeTask, moveTask, loading }}>
      {children}
    </TaskContext.Provider>
  );
};
import { createContext, useContext } from 'react';
import type { Task } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  completeTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    toast.success('Tarefa criada com sucesso!');
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
    toast.success('Tarefa atualizada!');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Tarefa removida!');
  };

  const duplicateTask = (id: string) => {
    const originalTask = tasks.find(task => task.id === id);
    if (originalTask) {
      const newTask = {
        ...originalTask,
        id: Date.now().toString(),
        title: `${originalTask.title} (Cópia)`,
        createdAt: new Date(),
        status: 'pending' as const
      };
      setTasks([...tasks, newTask]);
      toast.success('Tarefa duplicada!');
    }
  };

  const completeTask = (id: string) => {
    updateTask(id, { status: 'completed' });
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      duplicateTask,
      completeTask,
      moveTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type Category = 'work' | 'studies' | 'personal' | 'financial' | 'health' | 'projects' | string;

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  createdAt: Date;
  dueDate: Date | null;
  status: Status;
  color: string;
  tags: string[];
}

export interface Goal {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
  defaultView: 'list' | 'kanban' | 'calendar';
}

export interface PriorityConfig {
  label: string;
  color: string;
  icon: string;
}

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  low: { label: 'Baixa', color: '#10B981', icon: 'FaRegCircle' },
  medium: { label: 'Média', color: '#F59E0B', icon: 'FaRegDotCircle' },
  high: { label: 'Alta', color: '#EF4444', icon: 'FaExclamationCircle' },
  urgent: { label: 'Urgente', color: '#7C3AED', icon: 'FaExclamationTriangle' }
};

export const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: '#6B7280', icon: 'FaClock' },
  'in-progress': { label: 'Em andamento', color: '#3B82F6', icon: 'FaSpinner' },
  completed: { label: 'Concluído', color: '#10B981', icon: 'FaCheckCircle' },
  cancelled: { label: 'Cancelado', color: '#EF4444', icon: 'FaTimesCircle' }
};

export const CATEGORIES = [
  { id: 'work', name: 'Trabalho', color: '#4F46E5', icon: 'FaBriefcase' },
  { id: 'studies', name: 'Estudos', color: '#8B5CF6', icon: 'FaGraduationCap' },
  { id: 'personal', name: 'Pessoal', color: '#EC4899', icon: 'FaUser' },
  { id: 'financial', name: 'Financeiro', color: '#10B981', icon: 'FaMoneyBill' },
  { id: 'health', name: 'Saúde', color: '#F59E0B', icon: 'FaHeartbeat' },
  { id: 'projects', name: 'Projetos', color: '#06B6D4', icon: 'FaProjectDiagram' }
];
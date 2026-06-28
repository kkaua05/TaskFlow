/*
 * =============================================================================
 * TaskFlow - Tipos Globais (Legado)
 * =============================================================================
 *
 * Arquivo: src/types.ts
 * Descrição: (Legado) Define interfaces e constantes para Task, Goal,
 *            UserSettings, Note e NoteAttachment. Este arquivo está sendo
 *            gradualmente substituído pelo src/types/index.ts que possui
 *            tipos mais atualizados e completos.
 *
 * Constantes: PRIORITIES (Baixa/Média/Alta/Urgente),
 *             CATEGORIES (Trabalho/Pessoal/Estudo/Saúde/Outro),
 *             NOTE_COLORS (8 cores para notas)
 *
 * Tecnologias: TypeScript
 * =============================================================================
 */
// src/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Goal {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  defaultView: 'list' | 'kanban' | 'calendar';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  attachments: NoteAttachment[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  tags: string[];
}

export interface NoteAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'other';
  url: string;
  size: number;
}

export const PRIORITIES = {
  low: { label: 'Baixa', color: '#10B981' },
  medium: { label: 'Média', color: '#F59E0B' },
  high: { label: 'Alta', color: '#EF4444' },
  urgent: { label: 'Urgente', color: '#7C3AED' }
} as const;

export const CATEGORIES = [
  { id: 'work', name: 'Trabalho', color: '#4F46E5' },
  { id: 'personal', name: 'Pessoal', color: '#10B981' },
  { id: 'study', name: 'Estudo', color: '#8B5CF6' },
  { id: 'health', name: 'Saúde', color: '#EF4444' },
  { id: 'other', name: 'Outro', color: '#6B7280' }
] as const;

export const NOTE_COLORS = [
  { name: 'Branco', value: '#FFFFFF', textColor: '#1F2937' },
  { name: 'Vermelho', value: '#FEE2E2', textColor: '#7F1D1D' },
  { name: 'Amarelo', value: '#FEF3C7', textColor: '#78350F' },
  { name: 'Verde', value: '#D1FAE5', textColor: '#064E3B' },
  { name: 'Azul', value: '#DBEAFE', textColor: '#1E3A8A' },
  { name: 'Roxo', value: '#F3E8FF', textColor: '#4C1D95' },
  { name: 'Rosa', value: '#FCE7F3', textColor: '#831843' },
  { name: 'Cinza', value: '#F3F4F6', textColor: '#374151' }
];
import React, { createContext, useContext, useState, useEffect } from 'react';
import { graphNotesApi } from '../services/api';
import toast from 'react-hot-toast';

export interface GraphNote {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  links: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GraphNotesContextType {
  notes: GraphNote[];
  addNote: (note: GraphNote) => Promise<void>;
  updateNote: (id: string, updatedNote: Partial<GraphNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loading: boolean;
}

const GraphNotesContext = createContext<GraphNotesContextType | undefined>(undefined);

export const useGraphNotes = () => {
  const context = useContext(GraphNotesContext);
  if (!context) throw new Error('useGraphNotes must be used within a GraphNotesProvider');
  return context;
};

export const GraphNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<GraphNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    const loadedNotes = await graphNotesApi.getAll();
    setNotes(loadedNotes);
    setLoading(false);
  };

  const addNote = async (note: GraphNote) => {
    const newNote = await graphNotesApi.create(note);
    if (newNote) {
      setNotes([newNote, ...notes]);
      toast.success('Nota criada!');
    }
  };

  const updateNote = async (id: string, updatedNote: Partial<GraphNote>) => {
    const updated = await graphNotesApi.update(id, updatedNote);
    if (updated) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updated } : n));
      toast.success('Nota atualizada!');
    }
  };

  const deleteNote = async (id: string) => {
    const success = await graphNotesApi.delete(id);
    if (success) {
      setNotes(notes.filter(n => n.id !== id));
      toast.success('Nota removida!');
    }
  };

  return (
    <GraphNotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, loading }}>
      {children}
    </GraphNotesContext.Provider>
  );
};
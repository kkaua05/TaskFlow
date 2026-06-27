// src/contexts/NoteContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Note, NoteAttachment } from '../types';
import toast from 'react-hot-toast';

interface NoteContextType {
  notes: Note[];
  addNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'attachments'> & { attachments?: NoteAttachment[] }) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addAttachment: (noteId: string, attachment: Omit<NoteAttachment, 'id'>) => void;
  removeAttachment: (noteId: string, attachmentId: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('taskflow_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('taskflow_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned' | 'attachments'> & { attachments?: NoteAttachment[] }) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      attachments: noteData.attachments || []
    };
    setNotes(prev => [newNote, ...prev]);
    toast.success('Nota criada com sucesso!');
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    toast.success('Nota atualizada!');
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success('Nota removida!');
  }, []);

  const duplicateNote = useCallback((id: string) => {
    const original = notes.find(n => n.id === id);
    if (original) {
      const newNote: Note = {
        ...original,
        id: Date.now().toString(),
        title: `${original.title} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes(prev => [newNote, ...prev]);
      toast.success('Nota duplicada!');
    }
  }, [notes]);

  const togglePinNote = useCallback((id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  }, []);

  const addAttachment = useCallback((noteId: string, attachment: Omit<NoteAttachment, 'id'>) => {
    const newAttachment: NoteAttachment = {
      ...attachment,
      id: Date.now().toString() + Math.random()
    };
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, attachments: [...(note.attachments || []), newAttachment], updatedAt: new Date() }
        : note
    ));
    toast.success('Arquivo anexado!');
  }, []);

  const removeAttachment = useCallback((noteId: string, attachmentId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, attachments: (note.attachments || []).filter(a => a.id !== attachmentId), updatedAt: new Date() }
        : note
    ));
    toast.success('Anexo removido!');
  }, []);

  return (
    <NoteContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      duplicateNote,
      togglePinNote,
      addAttachment,
      removeAttachment
    }}>
      {children}
    </NoteContext.Provider>
  );
};
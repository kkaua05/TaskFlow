/*
 * =============================================================================
 * TaskFlow - NoteModal Component
 * =============================================================================
 *
 * Arquivo: src/components/Notes/NoteModal.tsx
 * Descrição: Modal para criação e edição de notas com editor completo:
 *            título, conteúdo, seletor de cores (8 opções) e tags.
 *            Bloqueia scroll do body quando aberto. Valida se há título
 *            ou conteúdo antes de salvar. Exibe preview do conteúdo.
 *
 * Props: isOpen, onClose, onSave, note (opcional para edição)
 *
 * Tecnologias: React, Framer Motion, react-icons, react-hot-toast
 * =============================================================================
 */
// src/components/Notes/NoteModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import type { Note } from '../../types';
import toast from 'react-hot-toast';

const NOTE_COLORS = [
  { name: 'Branco', value: '#FFFFFF', textColor: '#1F2937' },
  { name: 'Vermelho', value: '#FEE2E2', textColor: '#7F1D1D' },
  { name: 'Amarelo', value: '#FEF3C7', textColor: '#78350F' },
  { name: 'Verde', value: '#D1FAE5', textColor: '#064E3B' },
  { name: 'Azul', value: '#DBEAFE', textColor: '#1E3A8A' },
  { name: 'Roxo', value: '#F3E8FF', textColor: '#4C1D95' },
  { name: 'Rosa', value: '#FCE7F3', textColor: '#831843' },
  { name: 'Cinza', value: '#F3F4F6', textColor: '#374151' }
];

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  note
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0].value);
    }
    
    // Prevenir scroll do body quando o modal está aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Adicione um título ou conteúdo');
      return;
    }
    
    onSave({
      title: title.trim() || 'Nota sem título',
      content,
      color,
      attachments: []
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Fundo escuro que cobre toda a tela */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
            }}
          />
          
          {/* Modal Centralizado */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                duration: 0.3
              }}
              style={{
                pointerEvents: 'auto',
                width: '90%',
                maxWidth: '550px',
                maxHeight: '85vh',
                background: 'var(--bg-secondary)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--glass-border)',
                margin: 'auto'
              }}
            >
              {/* Header com gradiente */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.35rem', 
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {note ? '✏️ Editar Nota' : '📝 Nova Nota'}
                  </h2>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem'
                  }}>
                    {note ? 'Modifique os campos abaixo' : 'Preencha os campos abaixo'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px'
                  }}
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>

              {/* Content - Rolável */}
              <div style={{ 
                padding: '1.5rem', 
                overflowY: 'auto', 
                flex: 1,
                maxHeight: 'calc(85vh - 140px)'
              }}>
                {/* Seletor de Cores */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: '0.75rem', 
                    display: 'block', 
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    🎨 Cor da Nota
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {NOTE_COLORS.map(c => (
                      <motion.button
                        key={c.value}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setColor(c.value)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: c.value,
                          border: color === c.value ? '3px solid #4F46E5' : '2px solid var(--border)',
                          cursor: 'pointer',
                          boxShadow: color === c.value ? '0 0 0 2px rgba(79,70,229,0.3)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Campo Título */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: '0.5rem', 
                    display: 'block', 
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    📌 Título
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o título da nota..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      background: 'var(--bg-tertiary)',
                      border: '2px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4F46E5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Campo Conteúdo */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ 
                    fontSize: '0.85rem', 
                    marginBottom: '0.5rem', 
                    display: 'block', 
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    📄 Conteúdo
                  </label>
                  <textarea
                    placeholder="Escreva sua nota aqui..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      background: 'var(--bg-tertiary)',
                      border: '2px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4F46E5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Footer com botões */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                background: 'var(--bg-secondary)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  style={{
                    padding: '0.625rem 1.5rem',
                    background: 'transparent',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  style={{
                    padding: '0.625rem 2rem',
                    background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                  }}
                >
                  {note ? '💾 Atualizar' : '✨ Criar'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
/*
 * =============================================================================
 * TaskFlow - NoteCard Component
 * =============================================================================
 *
 * Arquivo: src/components/Notes/NoteCard.tsx
 * Descrição: Card de nota visual com cor de fundo personalizável, título,
 *            preview do conteúdo, indicador de anexos e data de atualização.
 *            Inclui ações: Fixar/Desafixar, Ver anexos, Duplicar e Excluir.
 *            Usa Framer Motion para animações de layout e hover.
 *
 * Props: note, onEdit, onDelete, onDuplicate, onTogglePin, onOpenAttachments
 *
 * Tecnologias: React, Framer Motion, react-icons, date-fns
 * =============================================================================
 */
// src/components/Notes/NoteCard.tsx
import { motion } from 'framer-motion';
import { FaTrash, FaCopy, FaThumbtack, FaPaperclip, FaFileImage, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import type { Note } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAttachments: (note: Note) => void;
}

const getAttachmentIcon = (type: string) => {
  switch (type) {
    case 'image': return <FaFileImage size={12} />;
    case 'pdf': return <FaFilePdf size={12} />;
    default: return <FaFileAlt size={12} />;
  }
};

const getColorStyle = (colorValue: string) => {
  const NOTE_COLORS: Array<{ name: string; value: string; textColor: string }> = [
    { name: 'Branco', value: '#FFFFFF', textColor: '#1F2937' },
    { name: 'Vermelho', value: '#FEE2E2', textColor: '#7F1D1D' },
    { name: 'Amarelo', value: '#FEF3C7', textColor: '#78350F' },
    { name: 'Verde', value: '#D1FAE5', textColor: '#064E3B' },
    { name: 'Azul', value: '#DBEAFE', textColor: '#1E3A8A' },
    { name: 'Roxo', value: '#F3E8FF', textColor: '#4C1D95' },
    { name: 'Rosa', value: '#FCE7F3', textColor: '#831843' },
    { name: 'Cinza', value: '#F3F4F6', textColor: '#374151' }
  ];
  const color = NOTE_COLORS.find(c => c.value === colorValue);
  return {
    background: colorValue,
    color: color?.textColor || '#1F2937'
  };
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePin,
  onOpenAttachments
}) => {
  const colorStyle = getColorStyle(note.color);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        ...colorStyle,
        borderRadius: '12px',
        padding: '1rem',
        position: 'relative',
        cursor: 'pointer',
        height: 'fit-content',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
      onClick={() => onEdit(note)}
    >
      {/* Pin Icon */}
      {note.isPinned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: '#F59E0B',
          fontSize: '14px'
        }}>
          📌
        </div>
      )}

      {/* Title */}
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        paddingRight: '24px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {note.title || 'Sem título'}
      </h3>

      {/* Content Preview */}
      <p style={{
        fontSize: '0.85rem',
        lineHeight: '1.4',
        opacity: 0.8,
        flex: 1,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {note.content || 'Sem conteúdo...'}
      </p>

      {/* Attachments Preview */}
      {note.attachments && note.attachments.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          fontSize: '0.7rem',
          opacity: 0.7
        }}>
          <FaPaperclip size={10} />
          <span>{note.attachments.length} anexo(s)</span>
          {note.attachments.slice(0, 2).map(att => (
            <span key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {getAttachmentIcon(att.type)}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        fontSize: '0.65rem',
        opacity: 0.6
      }}>
        <span>
          {format(note.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTogglePin(note.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px'
            }}
            title={note.isPinned ? 'Desafixar' : 'Fixar'}
          >
            <FaThumbtack size={10} style={{ opacity: note.isPinned ? 1 : 0.5 }} />
          </motion.button>
          
          {note.attachments && note.attachments.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onOpenAttachments(note)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px'
              }}
              title="Ver anexos"
            >
              <FaPaperclip size={10} />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDuplicate(note.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px'
            }}
          >
            <FaCopy size={10} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(note.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px',
              color: '#EF4444'
            }}
          >
            <FaTrash size={10} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
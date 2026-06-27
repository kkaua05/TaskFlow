import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStickyNote, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaCopy, 
  FaUpload,
  FaImage,
  FaFilePdf,
  FaFileAlt,
  FaTimes,
  FaSave,
  FaPaperclip,
  FaSearch,
  FaThLarge,
  FaList,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
// @ts-ignore - react-color não tem tipos
import { ChromePicker } from 'react-color';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ReactMarkdown from 'react-markdown';

// Tipos
interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string;
  size: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  tags: string[];
  attachments: Attachment[];
}

type ViewMode = 'grid' | 'list';
type SortBy = 'date' | 'title' | 'favorite';

export const Notes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    content: '',
    color: '#4F46E5',
    tags: [],
    attachments: []
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar e ordenar notas
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'favorite') return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      return 0;
    });

  // Criar nova nota
  const handleCreateNote = () => {
    setFormData({
      title: '',
      content: '',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tags: [],
      attachments: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Salvar nota
  const handleSaveNote = () => {
    if (!formData.title?.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    if (isEditing && selectedNote) {
      const updatedNote: Note = {
        ...selectedNote,
        ...formData,
        updatedAt: new Date(),
        title: formData.title!,
        content: formData.content || '',
        color: formData.color || selectedNote.color,
        tags: formData.tags || selectedNote.tags,
        attachments: formData.attachments || selectedNote.attachments
      };
      setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
      toast.success('Nota atualizada com sucesso!');
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title!,
        content: formData.content || '',
        color: formData.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        tags: formData.tags || [],
        attachments: formData.attachments || []
      };
      setNotes([newNote, ...notes]);
      toast.success('Nota criada com sucesso!');
    }
    setIsModalOpen(false);
    setSelectedNote(null);
    setShowColorPicker(false);
  };

  // Excluir nota
  const handleDeleteNote = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      setNotes(notes.filter(n => n.id !== id));
      toast.success('Nota excluída!');
    }
  };

  // Duplicar nota
  const handleDuplicateNote = (note: Note) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    toast.success('Nota duplicada!');
  };

  // Favoritar nota
  const handleToggleFavorite = (id: string) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date() } : n
    ));
  };

  // Adicionar tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Remover tag
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  // Upload de anexo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const attachment: Attachment = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
          url: reader.result as string,
          size: file.size
        };
        setFormData({
          ...formData,
          attachments: [...(formData.attachments || []), attachment]
        });
        toast.success(`Anexo "${file.name}" adicionado!`);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remover anexo
  const handleRemoveAttachment = (attachmentId: string) => {
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter(a => a.id !== attachmentId)
    });
    toast.success('Anexo removido!');
  };

  // Importar nota
  const handleImportNote = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const lines = content.split('\n');
          const titleLine = lines.find(l => l.startsWith('# '));
          const title = titleLine ? titleLine.replace('# ', '').trim() : 'Nota Importada';
          const noteContent = lines.filter(l => !l.startsWith('# ')).join('\n').trim();
          
          const newNote: Note = {
            id: Date.now().toString(),
            title,
            content: noteContent,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            isFavorite: false,
            tags: [],
            attachments: []
          };
          setNotes([newNote, ...notes]);
          toast.success('Nota importada com sucesso!');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Card de Nota
  const NoteCard = ({ note }: { note: Note }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="glass"
      style={{
        background: `linear-gradient(135deg, ${note.color}15, ${note.color}05)`,
        borderTop: `3px solid ${note.color}`,
        padding: '1rem',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <FaStickyNote style={{ color: note.color }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '600', flex: 1 }}>{note.title}</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(note.id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: note.isFavorite ? '#F59E0B' : 'var(--text-secondary)' }}
          >
            {note.isFavorite ? <FaStar /> : <FaRegStar />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleDuplicateNote(note); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <FaCopy size={12} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setSelectedNote(note); setFormData(note); setIsEditing(true); setIsModalOpen(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <FaEdit size={12} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
          >
            <FaTrash size={12} />
          </motion.button>
        </div>
      </div>
      
      <div 
        onClick={() => { setSelectedNote(note); setFormData(note); setIsEditing(true); setIsModalOpen(true); }}
        style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}
      >
        <ReactMarkdown>{note.content.slice(0, 150)}</ReactMarkdown>
      </div>
      
      {note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ 
              background: `${note.color}20`, 
              color: note.color,
              padding: '0.125rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.65rem'
            }}>
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>+{note.tags.length - 3}</span>}
        </div>
      )}
      
      {note.attachments.length > 0 && (
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {note.attachments.slice(0, 2).map(att => (
            <div key={att.id} style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {att.type === 'image' ? <FaImage size={10} /> : att.type === 'pdf' ? <FaFilePdf size={10} /> : <FaFileAlt size={10} />}
              <span>{att.name.length > 15 ? att.name.slice(0, 12) + '...' : att.name}</span>
            </div>
          ))}
          {note.attachments.length > 2 && <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>+{note.attachments.length - 2}</span>}
        </div>
      )}
      
      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
        {format(new Date(note.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Notes
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Organize suas ideias, anexos e documentos
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleImportNote}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaUpload /> Importar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNote}
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <FaPlus /> Nova Nota
          </motion.button>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar notas por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'var(--text-primary)'
            }}
          >
            <option value="date">Mais Recentes</option>
            <option value="title">Título</option>
            <option value="favorite">Favoritos</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              padding: '0.5rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {viewMode === 'grid' ? <FaList /> : <FaThLarge />}
          </motion.button>
        </div>
      </div>

      {/* Lista de Notas */}
      {filteredNotes.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <FaStickyNote size={48} style={{ color: '#8B5CF6', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhuma nota encontrada</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Clique em "Nova Nota" para criar sua primeira nota!</p>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'none',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          flexWrap: viewMode === 'list' ? 'wrap' : 'nowrap',
          gap: '1rem'
        }}>
          <AnimatePresence>
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => {
              setIsModalOpen(false);
              setShowColorPicker(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass"
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditing ? 'Editar Nota' : 'Nova Nota'}</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowColorPicker(false);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Cor da Nota */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Cor da Nota</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '8px',
                      background: formData.color,
                      cursor: 'pointer',
                      border: '2px solid var(--border)'
                    }}
                  />
                  {showColorPicker && (
                    <div style={{ position: 'absolute', zIndex: 1001 }}>
                      <div
                        onClick={() => setShowColorPicker(false)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                      />
                      <ChromePicker
                        color={formData.color}
                        onChange={(color: { hex: string }) => setFormData({ ...formData, color: color.hex })}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Título */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Título *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título da nota..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Conteúdo com Markdown */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Conteúdo (Markdown)</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  placeholder="Escreva sua nota aqui... Suporta **Markdown**"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Digite uma tag e pressione Enter"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTag}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Adicionar
                  </motion.button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.tags?.map(tag => (
                    <span key={tag} style={{
                      background: `${formData.color}20`,
                      color: formData.color,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      #{tag}
                      <FaTimes
                        size={10}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Anexos */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Anexos</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px dashed var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  <FaPaperclip /> Anexar arquivos (Imagens/PDF)
                </motion.button>
                {formData.attachments && formData.attachments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {formData.attachments.map(att => (
                      <div key={att.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {att.type === 'image' ? <FaImage /> : att.type === 'pdf' ? <FaFilePdf /> : <FaFileAlt />}
                          <span style={{ fontSize: '0.85rem' }}>{att.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            {(att.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveAttachment(att.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                        >
                          <FaTrash size={12} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview Markdown */}
              {formData.content && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Preview</label>
                  <div style={{
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveNote}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10B981, #34D399)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <FaSave style={{ marginRight: '0.5rem' }} />
                  {isEditing ? 'Atualizar Nota' : 'Criar Nota'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowColorPicker(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaEdit, FaTimes, FaSave, FaSearch, 
  FaLink, FaStar, FaRegStar, FaCodeBranch,
  FaEye, FaEyeSlash, FaDownload, FaInfoCircle,
  FaArrowsAlt, FaHandPointer, FaExpand, FaSyncAlt
} from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import * as d3 from 'd3';
import { useGraphNotes } from '../contexts/GraphNotesContext';
import type { GraphNote } from '../contexts/GraphNotesContext';

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

// Função segura para formatar data
const formatDateSafe = (date: Date | string | undefined): string => {
  if (!date) return 'Data inválida';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

export const GraphNotes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, loading } = useGraphNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<GraphNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  const [formData, setFormData] = useState<Partial<GraphNote>>({
    title: '',
    content: '',
    color: '#4F46E5',
    tags: [],
    links: []
  });
  const [tagInput, setTagInput] = useState('');

  // Extrair links do conteúdo [[Título]]
  const extractLinksFromContent = useCallback((content: string, allNotes: GraphNote[]): string[] => {
    const linkRegex = /\[\[(.*?)\]\]/g;
    const matches = content.matchAll(linkRegex);
    const links: string[] = [];
    
    for (const match of matches) {
      const linkTitle = match[1].trim();
      const foundNote = allNotes.find(n => n.title === linkTitle);
      if (foundNote && !links.includes(foundNote.id)) {
        links.push(foundNote.id);
      }
    }
    return links;
  }, []);

  // Gerar dados do grafo (nós e links)
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = notes.map(note => ({
      id: note.id,
      name: note.title,
      val: (note.links?.length || 0) + 1,
      color: note.color || '#4F46E5',
      group: note.tags?.length ? note.tags[0].charCodeAt(0) % 10 : 0,
    }));

    const links: GraphLink[] = [];
    notes.forEach(note => {
      (note.links || []).forEach(targetId => {
        if (notes.some(n => n.id === targetId)) {
          links.push({ source: note.id, target: targetId, value: 1 });
        }
      });
    });

    return { nodes, links };
  }, [notes]);

  // Inicializar grafo D3
  useEffect(() => {
    if (!svgRef.current || !showGraph) return;

    // Se não há nós, limpar e mostrar mensagem
    if (graphData.nodes.length === 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      return;
    }

    const width = svgRef.current.clientWidth || 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });
    svg.call(zoom);

    // Defs
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'linkGradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#4F46E5');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#8B5CF6');

    const glow = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    glow.append('feMerge')
      .selectAll('feMergeNode')
      .data(['coloredBlur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d: any) => d);

    // Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(graphData.links)
      .enter()
      .append('path')
      .attr('stroke', 'url(#linkGradient)')
      .attr('stroke-width', 2.5)
      .attr('stroke-opacity', 0.7)
      .attr('fill', 'none');

    // Nós
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (dragEvent, dragData) => {
          dragEvent.sourceEvent.stopPropagation();
          setIsDragging(true);
          if (!dragEvent.active) simulationRef.current?.alphaTarget(0.3).restart();
          dragData.fx = dragData.x;
          dragData.fy = dragData.y;
        })
        .on('drag', (dragEvent, dragData) => {
          dragData.fx = dragEvent.x;
          dragData.fy = dragEvent.y;
        })
        .on('end', (dragEvent, dragData) => {
          setIsDragging(false);
          if (!dragEvent.active) simulationRef.current?.alphaTarget(0);
          dragData.fx = null;
          dragData.fy = null;
        }));

    // Círculos
    node.append('circle')
      .attr('r', 28)
      .attr('fill', (d: any) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#glow)')
      .on('mouseenter', function(this: SVGCircleElement, _event, d: any) {
        setHoveredNode(d.id);
        d3.select(this).transition().duration(200).attr('r', 36).attr('stroke-width', 3.5);
      })
      .on('mouseleave', function(this: SVGCircleElement) {
        setHoveredNode(null);
        d3.select(this).transition().duration(200).attr('r', 28).attr('stroke-width', 2.5);
      })
      .on('click', (_event, d: any) => {
        const note = notes.find(n => n.id === d.id);
        if (note) {
          setSelectedNote(note);
          setFormData(note);
          setIsEditing(true);
          setIsModalOpen(true);
        }
      });

    // Ícone
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .attr('fill', '#fff')
      .attr('font-size', '22px')
      .text('📝')
      .style('pointer-events', 'none');

    // Título
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 45)
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text((d: any) => d.name.length > 18 ? d.name.slice(0, 15) + '...' : d.name)
      .style('pointer-events', 'none');

    // Desenhar linha curva
    const drawCurvedLine = (source: any, target: any) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const curvature = 0.5;
      const offsetX = dy * curvature;
      const offsetY = -dx * curvature;
      const midX = (source.x + target.x) / 2 + offsetX;
      const midY = (source.y + target.y) / 2 + offsetY;
      return `M${source.x},${source.y} Q${midX},${midY} ${target.x},${target.y}`;
    };

    // Simulação de força
    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force('charge', d3.forceManyBody().strength(-500).distanceMin(50).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50).strength(0.7))
      .force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(180).strength(0.5))
      .alpha(0.5)
      .alphaDecay(0.02)
      .velocityDecay(0.5);

    simulation.on('tick', () => {
      node.attr('transform', (d: any) => `translate(${Math.max(30, Math.min(width - 30, d.x))},${Math.max(30, Math.min(height - 30, d.y))})`);
      link.attr('d', (d: any) => drawCurvedLine(d.source, d.target));
    });

    simulationRef.current = simulation;

    // Centralizar
    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);
    svg.call(zoom.transform, initialTransform);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, showGraph, notes]);

  // Handlers
  const handleCreateNote = () => {
    setFormData({
      title: '',
      content: '',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tags: [],
      links: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!formData.title?.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    const extractedLinks = extractLinksFromContent(formData.content || '', notes);
    
    if (extractedLinks.length > 0) {
      toast.success(`🔗 ${extractedLinks.length} conexão(ões) detectada(s)!`);
    }
    
    if (isEditing && selectedNote) {
      await updateNote(selectedNote.id, {
        title: formData.title,
        content: formData.content,
        color: formData.color,
        tags: formData.tags,
        links: extractedLinks
      });
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: formData.title!,
        content: formData.content || '',
        color: formData.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: formData.tags || [],
        links: extractedLinks,
        isFavorite: false
      };
      await addNote(newNote);
    }
    
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      await deleteNote(id);
      toast.success('Nota excluída!');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { isFavorite: !note.isFavorite });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const handleForceRefreshGraph = () => {
    setShowGraph(false);
    setTimeout(() => setShowGraph(true), 100);
    toast.success('Grafo recarregado!');
  };

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleExportNotes = () => {
    const exportData = notes.map(note => ({
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      links: note.links.map(linkId => notes.find(n => n.id === linkId)?.title || linkId)
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph-notes-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Notas exportadas!');
  };

  const resetView = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth || 800;
      const height = 500;
      const zoom = d3.zoom<SVGSVGElement, unknown>();
      const transform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);
      svg.transition().duration(500).call(zoom.transform, transform);
      setZoomLevel(0.8);
      toast.success('Visualização resetada!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #4F46E5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Carregando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Graph Notes
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Conecte suas ideias com links bidirecionais e visualize seu conhecimento
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelp(!showHelp)}
            style={{
              background: showHelp ? 'linear-gradient(135deg, #4F46E5, #8B5CF6)' : 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              color: showHelp ? 'white' : 'var(--text-primary)'
            }}
          >
            <FaInfoCircle /> {showHelp ? 'Ocultar dicas' : 'Mostrar dicas'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGraph(!showGraph)}
            style={{
              background: showGraph ? 'linear-gradient(135deg, #4F46E5, #8B5CF6)' : 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              color: showGraph ? 'white' : 'var(--text-primary)'
            }}
          >
            {showGraph ? <FaEyeSlash /> : <FaEye />}
            {showGraph ? 'Esconder Grafo' : 'Mostrar Grafo'}
          </motion.button>
          {showGraph && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetView}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <FaExpand /> Resetar Visão
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleForceRefreshGraph}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <FaSyncAlt /> Recarregar
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportNotes}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <FaDownload /> Exportar
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
              fontWeight: '600'
            }}
          >
            <FaPlus /> Nova Nota
          </motion.button>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '1rem', background: 'linear-gradient(135deg, #4F46E515, #8B5CF615)' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div><strong>1.</strong> Crie duas ou mais notas</div>
            <div><strong>2.</strong> No conteúdo, escreva <code style={{ background: '#4F46E520', padding: '0.125rem 0.25rem', borderRadius: '4px' }}>[[Título da Outra Nota]]</code></div>
            <div><strong>3.</strong> Salve - a conexão será criada!</div>
            <div><strong>4.</strong> Arraste os nós para organizar</div>
            <div><strong>5.</strong> Use scroll para zoom</div>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
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
      </div>

      {/* Graph Visualization */}
      {showGraph && (
        <div className="glass" style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)' }} />
          {graphData.nodes.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <FaCodeBranch size={48} style={{ color: '#8B5CF6', opacity: 0.5, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Crie notas e use [[Título]] para ver o grafo!</p>
            </div>
          )}
          {graphData.nodes.length > 0 && graphData.links.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
              <p style={{ fontSize: '12px' }}>💡 Nenhuma conexão. Use [[Título]] no conteúdo!</p>
            </div>
          )}
          {graphData.nodes.length > 0 && (
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px' }}>
              {graphData.nodes.length} nós | {graphData.links.length} conexões | Zoom: {Math.round(zoomLevel * 100)}%
            </div>
          )}
          {isDragging && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px' }}>
              <FaArrowsAlt /> Arrastando...
            </div>
          )}
          {hoveredNode && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px' }}>
              <FaHandPointer /> {hoveredNode}
            </div>
          )}
        </div>
      )}

      {/* Notes List */}
      <div style={{ flex: showGraph ? 1 : 2, overflowY: 'auto', maxHeight: '300px' }}>
        {filteredNotes.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <FaCodeBranch size={48} style={{ color: '#8B5CF6', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Nenhuma nota encontrada</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Clique em "Nova Nota" para começar!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {filteredNotes.map(note => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass"
                style={{
                  background: `linear-gradient(135deg, ${note.color}15, ${note.color}05)`,
                  borderTop: `3px solid ${note.color}`,
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <FaCodeBranch style={{ color: note.color }} />
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
                  <ReactMarkdown>{(note.content || '').slice(0, 150)}</ReactMarkdown>
                </div>
                
                {(note.links && note.links.length > 0) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaLink size={10} style={{ color: note.color }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{note.links.length} conexão(ões)</span>
                  </div>
                )}
                
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                  {formatDateSafe(note.updatedAt)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

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
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass"
              style={{
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditing ? 'Editar Nota' : 'Nova Nota'}</h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <FaTimes />
                </motion.button>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <FaLink /> Use <strong>[[Título da Nota]]</strong> para criar links: <code>[[Título Exato da Outra Nota]]</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Cor</label>
                <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ width: '100%', height: '40px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Título *</label>
                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Digite o título da nota..." style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Conteúdo</label>
                <textarea 
                  value={formData.content || ''} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  rows={6} 
                  placeholder="Exemplo: Este é um link para [[Outra Nota]] que será conectada no grafo!" 
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'monospace' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} placeholder="Tag + Enter" style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <motion.button whileHover={{ scale: 1.05 }} onClick={handleAddTag} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Adicionar</motion.button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.tags?.map(tag => (
                    <span key={tag} style={{ background: `${formData.color}20`, color: formData.color, padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      #{tag} <FaTimes size={10} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveNote} style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #10B981, #34D399)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                  <FaSave /> {isEditing ? 'Atualizar' : 'Criar'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        code {
          background: rgba(79, 70, 229, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </motion.div>
  );
};
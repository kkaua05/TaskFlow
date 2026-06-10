import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTrash, FaCalendarAlt, FaDownload, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface CompletedTasksProps {
  onBack: () => void;
}

type FilterType = 'all' | 'today' | 'week' | 'month' | 'year';

export const CompletedTasks: React.FC<CompletedTasksProps> = ({ onBack }) => {
  const { tasks, deleteTask, duplicateTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const completedTasks = tasks.filter(task => task.status === 'completed');

  const filterTasks = (tasksToFilter: Task[]) => {
    let filtered = [...tasksToFilter];
    const now = new Date();

    switch (filter) {
      case 'today':
        filtered = filtered.filter(task => 
          new Date(task.createdAt).toDateString() === now.toDateString()
        );
        break;
      case 'week': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(task => new Date(task.createdAt) >= weekAgo);
        break;
      }
      case 'month': {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(task => new Date(task.createdAt) >= monthAgo);
        break;
      }
      case 'year': {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        filtered = filtered.filter(task => new Date(task.createdAt) >= yearAgo);
        break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTasks = filterTasks(completedTasks);

  const statistics = {
    total: completedTasks.length,
    totalThisMonth: completedTasks.filter(task => {
      const now = new Date();
      return new Date(task.createdAt).getMonth() === now.getMonth() &&
             new Date(task.createdAt).getFullYear() === now.getFullYear();
    }).length,
    totalThisWeek: completedTasks.filter(task => {
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return new Date(task.createdAt) >= weekAgo;
    }).length,
    totalToday: completedTasks.filter(task => {
      const now = new Date();
      return new Date(task.createdAt).toDateString() === now.toDateString();
    }).length,
  };

  const productivity = {
    daily: tasks.length > 0 ? ((statistics.totalToday / tasks.length) * 100).toFixed(1) : '0',
    weekly: tasks.length > 0 ? ((statistics.totalThisWeek / tasks.length) * 100).toFixed(1) : '0',
    monthly: tasks.length > 0 ? ((statistics.totalThisMonth / tasks.length) * 100).toFixed(1) : '0',
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length === 0) {
      toast.error('Selecione pelo menos uma tarefa');
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir ${selectedTasks.length} tarefa(s)?`)) {
      selectedTasks.forEach(id => deleteTask(id));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tarefa(s) excluída(s)!`);
    }
  };

  const exportToCSV = () => {
    const headers = ['Título', 'Descrição', 'Categoria', 'Prioridade', 'Data de Criação', 'Data de Conclusão'];
    const csvData = filteredTasks.map(task => [
      `"${task.title}"`,
      `"${task.description || ''}"`,
      `"${task.category}"`,
      `"${task.priority}"`,
      `"${format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm')}"`,
      task.dueDate ? `"${format(new Date(task.dueDate), 'dd/MM/yyyy HH:mm')}"` : 'N/A'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `tarefas-concluidas-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Relatório exportado com sucesso!');
  };

  const handleBackClick = () => {
    console.log('Botão voltar clicado');
    onBack();
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass"
      style={{
        padding: '1rem',
        borderRadius: '12px',
        borderLeft: `3px solid ${color}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{title}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</h3>
        </div>
        <div style={{ color, fontSize: '1.5rem' }}>{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '1rem', minHeight: '100vh' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaArrowLeft /> Voltar
            </motion.button>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #10B981, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Tarefas Concluídas
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Gerencie suas conquistas e histórico de tarefas
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              style={{
                background: 'linear-gradient(135deg, #10B981, #34D399)',
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
              <FaDownload /> Exportar CSV
            </motion.button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard title="Total Concluídas" value={statistics.total} icon="✅" color="#10B981" />
        <StatCard title="Este Mês" value={statistics.totalThisMonth} icon="📅" color="#3B82F6" />
        <StatCard title="Esta Semana" value={statistics.totalThisWeek} icon="📊" color="#8B5CF6" />
        <StatCard title="Hoje" value={statistics.totalToday} icon="🎯" color="#F59E0B" />
      </div>

      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaChartLine /> Taxa de Produtividade
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Produtividade Diária</p>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', height: '8px', marginTop: '0.5rem' }}>
              <div style={{ background: 'linear-gradient(90deg, #10B981, #34D399)', width: `${productivity.daily}%`, height: '100%', borderRadius: '8px', transition: 'width 0.5s' }} />
            </div>
            <p style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>{productivity.daily}%</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Produtividade Semanal</p>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', height: '8px', marginTop: '0.5rem' }}>
              <div style={{ background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', width: `${productivity.weekly}%`, height: '100%', borderRadius: '8px', transition: 'width 0.5s' }} />
            </div>
            <p style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>{productivity.weekly}%</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Produtividade Mensal</p>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', height: '8px', marginTop: '0.5rem' }}>
              <div style={{ background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', width: `${productivity.monthly}%`, height: '100%', borderRadius: '8px', transition: 'width 0.5s' }} />
            </div>
            <p style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>{productivity.monthly}%</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'today', label: 'Hoje' },
            { id: 'week', label: 'Esta Semana' },
            { id: 'month', label: 'Este Mês' },
            { id: 'year', label: 'Este Ano' }
          ].map(f => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id as FilterType)}
              style={{
                padding: '0.5rem 1rem',
                background: filter === f.id ? 'linear-gradient(135deg, #10B981, #34D399)' : 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '8px',
                color: filter === f.id ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: filter === f.id ? '600' : '400'
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                width: '200px'
              }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            style={{
              padding: '0.5rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {viewMode === 'list' ? '📋' : '🔲'}
          </motion.button>
          
          {selectedTasks.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleDeleteSelected}
              style={{
                padding: '0.5rem 1rem',
                background: '#EF4444',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaTrash /> Excluir ({selectedTasks.length})
            </motion.button>
          )}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <FaCheckCircle size={48} style={{ color: '#10B981', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhuma tarefa concluída</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Complete tarefas para vê-las aqui e acompanhar seu progresso!</p>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'block',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none',
          gap: '1rem'
        }}>
          <AnimatePresence>
            {filteredTasks.map(task => (
              <CompletedTaskCard
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
                onSelect={() => {
                  if (selectedTasks.includes(task.id)) {
                    setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                  } else {
                    setSelectedTasks([...selectedTasks, task.id]);
                  }
                }}
                onDelete={() => deleteTask(task.id)}
                onDuplicate={() => duplicateTask(task.id)}
                onRestore={() => {
                  updateTask(task.id, { status: 'pending' });
                  toast.success('Tarefa restaurada para Pendente!');
                  onBack();
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

const CompletedTaskCard: React.FC<{
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRestore: () => void;
}> = ({ task, isSelected, onSelect, onDelete, onDuplicate, onRestore }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      className="glass"
      style={{
        padding: '1rem',
        marginBottom: '0.75rem',
        borderLeft: '4px solid #10B981',
        position: 'relative',
        opacity: 0.9,
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '0.25rem',
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: '#10B981'
          }}
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                textDecoration: 'line-through',
                opacity: 0.7
              }}>
                {task.title}
              </h3>
              {task.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isHovered && (
                <>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={onRestore}
                    style={{
                      background: '#3B82F6',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  >
                    🔄 Restaurar
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={onDuplicate}
                    style={{
                      background: '#8B5CF6',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  >
                    📋 Duplicar
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={onDelete}
                    style={{
                      background: '#EF4444',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  >
                    🗑️ Excluir
                  </motion.button>
                </>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
            <span style={{
              background: '#10B98120',
              color: '#10B981',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.7rem'
            }}>
              ✅ Concluída
            </span>
            <span style={{
              background: '#F59E0B20',
              color: '#F59E0B',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.7rem'
            }}>
              {task.category}
            </span>
            {task.dueDate && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--text-secondary)',
                fontSize: '0.7rem'
              }}>
                <FaCalendarAlt size={10} />
                {format(new Date(task.dueDate), 'dd/MM/yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
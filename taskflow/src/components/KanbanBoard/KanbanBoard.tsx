import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Status } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const columns: { id: Status; title: string; color: string }[] = [
  { id: 'pending', title: 'Pendente', color: '#6B7280' },
  { id: 'in-progress', title: 'Em andamento', color: '#3B82F6' },
  { id: 'completed', title: 'Concluído', color: '#10B981' }
];

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onComplete: (id: string) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, onEdit, onDelete, onDuplicate, onComplete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '0.75rem',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onComplete={onComplete}
      />
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onCompleteTask,
  onEditTask,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);
    
    if (!activeTask || !overTask) return;
    
    if (activeTask.status !== overTask.status) {
      onUpdateTask(activeId, { status: overTask.status });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '1rem'
      }}>
        {columns.map(column => (
          <div
            key={column.id}
            className="glass"
            style={{
              padding: '1rem',
              background: 'var(--card-bg)',
              transition: 'background 0.3s ease',
              minHeight: '400px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: `2px solid ${column.color}`
            }}>
              <h3 style={{ color: column.color, fontWeight: '600' }}>{column.title}</h3>
              <span style={{
                background: column.color,
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.75rem'
              }}>
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <SortableContext
              items={getTasksByStatus(column.id).map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ minHeight: '200px' }}>
                {getTasksByStatus(column.id).map(task => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onDuplicate={onDuplicateTask}
                    onComplete={onCompleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};
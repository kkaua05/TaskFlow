import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTasks } from '../contexts/TaskContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Calendar: React.FC = () => {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = getDay(monthStart);
  const emptyDays = Array(startDay).fill(null);

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1rem' }}
    >
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Calendário
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Visualização mensal das tarefas
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(-1)}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <FaChevronLeft />
          </motion.button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '200px', textAlign: 'center' }}>
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(1)}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontWeight: '600',
              padding: '0.5rem',
              color: '#8B5CF6'
            }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem'
        }}>
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} style={{
              padding: '0.5rem',
              minHeight: '100px'
            }} />
          ))}
          
          {daysInMonth.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={day.toString()}
                whileHover={{ scale: 1.02 }}
                style={{
                  padding: '0.5rem',
                  minHeight: '100px',
                  background: isToday ? 'linear-gradient(135deg, #4F46E5, #8B5CF6)' : 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: isToday ? 'white' : 'var(--text-primary)'
                }}>
                  {format(day, 'd')}
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        marginBottom: '0.2rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: isToday ? 'white' : 'var(--text-secondary)'
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div style={{ color: isToday ? 'white' : '#8B5CF6', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      +{dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

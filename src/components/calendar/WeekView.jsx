import { useMemo } from 'react';
import { CalendarDay } from './CalendarDay';

export function WeekView({
  currentDate,
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask
}) {
  const weekDays = useMemo(() => {
    // Get the start of the week (Sunday)
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const isToday = date.getTime() === today.getTime();
      
      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: true,
        isToday
      });
    }
    
    return days;
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.getTime();
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="week-view">
      <div className="week-grid">
        {weekDays.map((day, index) => {
          const dateKey = day.date.getTime();
          const dayTasks = tasksByDate[dateKey] || [];
          
          return (
            <div key={index} className="week-day-column">
              <div className="week-day-header">
                <span className="week-day-name">{weekDayNames[index]}</span>
                <span className={`week-day-number ${day.isToday ? 'is-today' : ''}`}>
                  {day.dayNumber}
                </span>
              </div>
              
              <CalendarDay
                date={day.date}
                dayNumber={day.dayNumber}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                tasks={dayTasks}
                categories={categories}
                onAddTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                viewMode="week"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}



import { useMemo } from 'react';
import { CalendarDay } from './CalendarDay';

export function MonthView({
  currentDate,
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask
}) {
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Starting day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();
    
    // Days in the month
    const daysInMonth = lastDay.getDate();
    
    // Days in previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add trailing days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add days of current month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.getTime() === today.getTime();
      
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Add leading days from next month to complete the grid (42 days = 6 rows)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="month-view">
      <div className="calendar-weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday-label">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const dateKey = day.date.getTime();
          const dayTasks = tasksByDate[dateKey] || [];
          
          return (
            <CalendarDay
              key={index}
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
              viewMode="month"
            />
          );
        })}
      </div>
    </div>
  );
}



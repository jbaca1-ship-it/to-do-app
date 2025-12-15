import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import './CalendarView.css';

export function CalendarView({
  tasks,
  categories,
  loading,
  selectedCategory,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  sidebarOpen
}) {
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter tasks by selected category
  const filteredTasks = useMemo(() => {
    if (!selectedCategory) return tasks;
    return tasks.filter(t => t.categoryId === selectedCategory);
  }, [tasks, selectedCategory]);

  const currentCategory = categories.find(c => c.id === selectedCategory);

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const formatTitle = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      // For week view, show the date range
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()}-${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      } else {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      }
    }
  };

  return (
    <main className={`calendar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="calendar-header">
        <div className="calendar-title-section">
          <h2 className="calendar-title">
            {currentCategory ? (
              <>
                <span 
                  className="category-dot" 
                  style={{ backgroundColor: currentCategory.color }}
                />
                {currentCategory.name}
              </>
            ) : (
              'All Tasks'
            )}
          </h2>
          <span className="calendar-subtitle">{formatTitle()}</span>
        </div>

        <div className="calendar-controls">
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>

          <div className="calendar-navigation">
            <button
              className="nav-btn"
              onClick={goToPrevious}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="nav-btn today-btn"
              onClick={goToToday}
            >
              <CalendarIcon size={16} />
              <span>Today</span>
            </button>
            <button
              className="nav-btn"
              onClick={goToNext}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-content">
        {loading ? (
          <div className="calendar-loading">
            <div className="loading-spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : viewMode === 'month' ? (
          <MonthView
            currentDate={currentDate}
            tasks={filteredTasks}
            categories={categories}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            tasks={filteredTasks}
            categories={categories}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        )}
      </div>
    </main>
  );
}


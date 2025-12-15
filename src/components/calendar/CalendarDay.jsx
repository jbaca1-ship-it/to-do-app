import { useState } from 'react';
import { CalendarTask } from './CalendarTask';
import { TaskAddModal } from './TaskAddModal';
import { Plus } from 'lucide-react';

export function CalendarDay({
  date,
  dayNumber,
  isCurrentMonth,
  isToday,
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  viewMode
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskData = e.dataTransfer.getData('application/json');
    if (taskData) {
      try {
        const task = JSON.parse(taskData);
        // Update task's due date to this day
        const newDueDate = new Date(date);
        newDueDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        
        onUpdateTask(task.id, {
          ...task,
          dueDate: newDueDate.toISOString()
        });
      } catch (error) {
        console.error('Error dropping task:', error);
      }
    }
  };

  const handleDayClick = (e) => {
    // Only trigger if clicking the day cell itself, not a task
    if (e.target.closest('.calendar-task')) return;
    
    // Open the modal to create a new task
    setIsModalOpen(true);
  };

  // Check if any tasks are overdue
  const hasOverdueTasks = tasks.some(task => {
    if (task.completed) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  });

  // Sort tasks by priority and completion
  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Limit tasks shown in month view
  const displayTasks = viewMode === 'month' ? sortedTasks.slice(0, 3) : sortedTasks;
  const hasMoreTasks = viewMode === 'month' && sortedTasks.length > 3;

  return (
    <>
      <div
        className={`calendar-day 
          ${!isCurrentMonth ? 'other-month' : ''} 
          ${isToday ? 'is-today' : ''} 
          ${isDragOver ? 'drag-over' : ''}
          ${hasOverdueTasks ? 'has-overdue' : ''}
          ${viewMode === 'week' ? 'week-mode' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDayClick}
      >
        {viewMode === 'month' && (
          <div className="day-number">{dayNumber}</div>
        )}
        
        <div className="day-tasks">
          {displayTasks.map((task) => {
            const category = categories.find(c => c.id === task.categoryId);
            return (
              <CalendarTask
                key={task.id}
                task={task}
                category={category}
                categories={categories}
                onUpdateTask={onUpdateTask}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                viewMode={viewMode}
              />
            );
          })}
          
          {hasMoreTasks && (
            <div className="more-tasks">
              +{sortedTasks.length - 3} more
            </div>
          )}
        </div>

        {viewMode === 'week' && (
          <button
            className="add-task-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDayClick(e);
            }}
          >
            <Plus size={14} />
            <span>Add task</span>
          </button>
        )}
      </div>

      <TaskAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={onAddTask}
        categories={categories}
        initialDate={date}
      />
    </>
  );
}


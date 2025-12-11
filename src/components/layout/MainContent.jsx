import { useState, useMemo } from 'react';
import { TaskForm } from '../tasks/TaskForm';
import { TaskFilters } from '../tasks/TaskFilters';
import { SortableTaskList } from '../tasks/SortableTaskList';
import './MainContent.css';

export function MainContent({
  tasks,
  categories,
  loading,
  selectedCategory,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorderTasks
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dueDate: 'all'
  });

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by category
    if (selectedCategory) {
      result = result.filter(t => t.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(t => 
        filters.status === 'completed' ? t.completed : !t.completed
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);

      result = result.filter(t => {
        if (!t.dueDate) {
          return filters.dueDate === 'no-date';
        }
        
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        switch (filters.dueDate) {
          case 'today':
            return dueDate.getTime() === today.getTime();
          case 'week':
            return dueDate >= today && dueDate <= endOfWeek;
          case 'overdue':
            return dueDate < today && !t.completed;
          case 'no-date':
            return false;
          default:
            return true;
        }
      });
    }

    return result;
  }, [tasks, selectedCategory, searchQuery, filters]);

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <main className="main-content">
      <div className="main-header">
        <h2 className="page-title">
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
        <span className="task-count">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <TaskForm 
        onAddTask={onAddTask} 
        categories={categories} 
      />

      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
      />

      <SortableTaskList
        tasks={filteredTasks}
        categories={categories}
        loading={loading}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
        onUpdate={onUpdateTask}
        onAddSubtask={onAddSubtask}
        onToggleSubtask={onToggleSubtask}
        onDeleteSubtask={onDeleteSubtask}
        onReorder={onReorderTasks}
      />
    </main>
  );
}


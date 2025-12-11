import { TaskItem } from './TaskItem';
import { Loader2, ClipboardList } from 'lucide-react';
import './TaskList.css';

export function TaskList({ 
  tasks, 
  categories,
  loading,
  onToggle, 
  onDelete, 
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  dragHandleProps
}) {
  if (loading) {
    return (
      <div className="task-list-empty">
        <Loader2 className="spinner" size={32} />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <ClipboardList size={48} strokeWidth={1.5} />
        <h3>No tasks yet</h3>
        <p>Add your first task above to get started!</p>
      </div>
    );
  }

  const getCategoryById = (categoryId) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          category={getCategoryById(task.categoryId)}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          dragHandleProps={dragHandleProps?.(task, index)}
        />
      ))}
    </div>
  );
}


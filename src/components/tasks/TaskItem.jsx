import { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  Pencil
} from 'lucide-react';
import { SubtaskList } from './SubtaskList';
import './TaskItem.css';

export function TaskItem({ 
  task, 
  category,
  onToggle, 
  onDelete, 
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  dragHandleProps 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    await onUpdate(task.id, { 
      title: editTitle.trim(), 
      description: editDescription.trim() 
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
      setIsEditing(false);
    }
  };

  const subtaskProgress = task.subtasks?.length 
    ? task.subtasks.filter(st => st.completed).length 
    : 0;

  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ '--priority-color': priorityColors[task.priority] || priorityColors.medium }}
    >
      {category && (
        <div 
          className="task-category-indicator" 
          style={{ backgroundColor: category.color }}
        />
      )}
      
      <div className="task-main">
        <div className="task-drag-handle" {...dragHandleProps}>
          <GripVertical size={16} />
        </div>

        <button 
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="task-content">
          {isEditing ? (
            <div className="task-edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="task-edit-title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add description..."
                className="task-edit-description"
                rows={2}
              />
              <div className="task-edit-actions">
                <button onClick={() => setIsEditing(false)} className="btn-cancel-edit">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="btn-save-edit">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="task-title" onClick={() => setIsEditing(true)}>
                {task.title}
              </span>
              
              <div className="task-meta">
                {task.dueDate && (
                  <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                    <Calendar size={12} />
                    {formatDate(task.dueDate)}
                  </span>
                )}
                {task.subtasks?.length > 0 && (
                  <span className="task-subtask-count">
                    {subtaskProgress}/{task.subtasks.length} subtasks
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="task-actions">
          <button 
            className="task-action-btn"
            onClick={() => setIsEditing(!isEditing)}
            aria-label="Edit task"
          >
            <Pencil size={16} />
          </button>
          
          {(task.description || task.subtasks?.length > 0) && (
            <button 
              className="task-action-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          
          <button 
            className="task-action-btn delete"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && !isEditing && (
        <div className="task-expanded">
          {task.description && (
            <p className="task-description-text">{task.description}</p>
          )}
          
          <SubtaskList
            subtasks={task.subtasks || []}
            onAdd={(title) => onAddSubtask(task.id, title)}
            onToggle={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
            onDelete={(subtaskId) => onDeleteSubtask(task.id, subtaskId)}
          />
        </div>
      )}
    </div>
  );
}


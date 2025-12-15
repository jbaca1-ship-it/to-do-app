import { useState, useEffect, useRef } from 'react';
import { Check, Clock, CheckCircle, Edit2, Trash2, Calendar, Flag, FolderOpen, X } from 'lucide-react';
import { DatePicker } from '../ui/DatePicker';

export function CalendarTask({
  task,
  category,
  categories = [],
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  viewMode
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editCategoryId, setEditCategoryId] = useState(task.categoryId || '');
  const menuRef = useRef(null);
  const taskRef = useRef(null);
  const modalRef = useRef(null);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(task));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          taskRef.current && !taskRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isEditing) {
        handleCancelEdit();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isEditing) {
        handleCancelEdit();
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleTaskClick = (e) => {
    e.stopPropagation();
    
    // Get the click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = rect.bottom + 5; // Position below the task
    
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const handleMarkComplete = (e) => {
    e.stopPropagation();
    onToggleTask(task.id);
    setShowMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsEditing(true);
    // Reset edit fields to current task values
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditDueDate(task.dueDate || '');
    setEditCategoryId(task.categoryId || '');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    
    await onUpdateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
      categoryId: editCategoryId || null
    });
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditDueDate(task.dueDate || '');
    setEditCategoryId(task.categoryId || '');
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (task.completed) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const getPriorityColor = () => {
    if (category) return category.color;
    
    switch (task.priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      <div
        ref={taskRef}
        className={`calendar-task 
          ${task.completed ? 'completed' : ''} 
          ${isDragging ? 'dragging' : ''}
          ${isOverdue() ? 'overdue' : ''}
          ${viewMode === 'week' ? 'week-mode' : ''}
        `}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleTaskClick}
        style={{
          borderLeftColor: getPriorityColor()
        }}
      >
        <div className="task-content">
          {task.completed && (
            <div className="task-check-icon">
              <Check size={12} />
            </div>
          )}
          {isOverdue() && !task.completed && (
            <div className="task-overdue-icon">
              <Clock size={12} />
            </div>
          )}
          <span className="task-title">{task.title}</span>
        </div>
        
        {viewMode === 'week' && (
          <div className="task-meta">
            <span className="task-priority" data-priority={task.priority}>
              {task.priority}
            </span>
            {category && (
              <span 
                className="task-category-dot"
                style={{ backgroundColor: category.color }}
              />
            )}
          </div>
        )}
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="task-action-menu"
          style={{
            position: 'fixed',
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
        >
          <button 
            className="task-action-btn mark-complete-btn"
            onClick={handleMarkComplete}
          >
            <CheckCircle size={16} />
            <span>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
          </button>
          <button 
            className="task-action-btn edit-btn"
            onClick={handleEdit}
          >
            <Edit2 size={16} />
            <span>Edit Task</span>
          </button>
          <button 
            className="task-action-btn delete-btn"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Delete Task</span>
          </button>
        </div>
      )}

      {isEditing && (
        <div className="task-edit-modal-overlay">
          <div 
            ref={modalRef}
            className="task-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="task-edit-modal-header">
              <h3>Edit Task</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCancelEdit}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="task-edit-form">
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add description..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-due-date">
                    <Calendar size={16} />
                    Due Date
                  </label>
                  <DatePicker
                    value={editDueDate ? new Date(editDueDate).toISOString().split('T')[0] : ''}
                    onChange={(value) => setEditDueDate(value ? new Date(value).toISOString() : '')}
                    placeholder="Select due date"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-priority">
                    <Flag size={16} />
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {categories.length > 0 && (
                <div className="form-group">
                  <label htmlFor="edit-category">
                    <FolderOpen size={16} />
                    Category
                  </label>
                  <select
                    id="edit-category"
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">No category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-save"
                  disabled={!editTitle.trim()}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


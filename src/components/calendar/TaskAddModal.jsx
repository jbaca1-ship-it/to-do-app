import { useState, useEffect } from 'react';
import { X, Calendar, Flag, FolderOpen } from 'lucide-react';
import { DatePicker } from '../ui/DatePicker';

export function TaskAddModal({ isOpen, onClose, onAddTask, categories, initialDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial due date when modal opens
  useEffect(() => {
    if (isOpen && initialDate) {
      // Format date as YYYY-MM-DD for the input
      const date = new Date(initialDate);
      const formatted = date.toISOString().split('T')[0];
      setDueDate(formatted);
    }
  }, [isOpen, initialDate]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategoryId('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        categoryId: categoryId || null
      });
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="task-edit-modal-overlay" 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="task-edit-modal">
        <div className="task-edit-modal-header">
          <h3>Add New Task</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-edit-form">
          <div className="form-group">
            <label htmlFor="task-title">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="form-input"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="form-textarea"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-date">
                <Calendar size={16} />
                Due Date
              </label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={isSubmitting}
                placeholder="Select due date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">
                <Flag size={16} />
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="form-group">
              <label htmlFor="task-category">
                <FolderOpen size={16} />
                Category
              </label>
              <select
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select"
                disabled={isSubmitting}
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
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


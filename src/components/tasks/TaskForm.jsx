import { useState } from 'react';
import { Plus, Calendar, Flag, FolderOpen } from 'lucide-react';
import './TaskForm.css';

export function TaskForm({ onAddTask, categories = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategoryId('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExpanded) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form-main">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="task-input"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="task-add-btn"
          disabled={!title.trim() || isSubmitting}
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </div>

      {isExpanded && (
        <div className="task-form-expanded">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="task-description"
            rows={2}
          />

          <div className="task-form-options">
            <div className="option-group">
              <Calendar size={16} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="option-input date-input"
              />
            </div>

            <div className="option-group">
              <Flag size={16} />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="option-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {categories.length > 0 && (
              <div className="option-group">
                <FolderOpen size={16} />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="option-input"
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
          </div>

          <div className="task-form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-add"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}


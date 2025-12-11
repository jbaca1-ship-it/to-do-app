import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import './SubtaskList.css';

export function SubtaskList({ subtasks, onAdd, onToggle, onDelete }) {
  const [newSubtask, setNewSubtask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    await onAdd(newSubtask.trim());
    setNewSubtask('');
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd(e);
    }
    if (e.key === 'Escape') {
      setNewSubtask('');
      setIsAdding(false);
    }
  };

  return (
    <div className="subtask-list">
      <div className="subtask-header">
        <span className="subtask-label">Subtasks</span>
        {!isAdding && (
          <button 
            className="subtask-add-btn"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>

      {subtasks.map((subtask) => (
        <div 
          key={subtask.id} 
          className={`subtask-item ${subtask.completed ? 'completed' : ''}`}
        >
          <button 
            className={`subtask-checkbox ${subtask.completed ? 'checked' : ''}`}
            onClick={() => onToggle(subtask.id)}
          >
            {subtask.completed && <Check size={10} strokeWidth={3} />}
          </button>
          <span className="subtask-title">{subtask.title}</span>
          <button 
            className="subtask-delete"
            onClick={() => onDelete(subtask.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {isAdding && (
        <form onSubmit={handleAdd} className="subtask-add-form">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter subtask..."
            className="subtask-input"
            autoFocus
          />
          <button type="submit" className="subtask-confirm">
            <Check size={14} />
          </button>
          <button 
            type="button" 
            className="subtask-cancel"
            onClick={() => { setNewSubtask(''); setIsAdding(false); }}
          >
            <X size={14} />
          </button>
        </form>
      )}
    </div>
  );
}


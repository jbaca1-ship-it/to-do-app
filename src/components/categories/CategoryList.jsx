import { useState } from 'react';
import { FolderOpen, Plus, X, Check } from 'lucide-react';
import './CategoryList.css';

export function CategoryList({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  defaultColors 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(defaultColors?.[0] || '#3b82f6');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await onAddCategory({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(defaultColors?.[(categories.length + 1) % defaultColors.length] || '#3b82f6');
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
    }
  };

  return (
    <div className="category-list">
      <div className="category-header">
        <h3>Categories</h3>
        <button 
          className="category-add-trigger"
          onClick={() => setIsAdding(!isAdding)}
          aria-label="Add category"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="category-items">
        <button
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <FolderOpen size={16} />
          <span>All Tasks</span>
        </button>

        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <button
              className="category-item-btn"
              onClick={() => onSelectCategory(category.id)}
            >
              <span 
                className="category-color" 
                style={{ backgroundColor: category.color }}
              />
              <span className="category-name">{category.name}</span>
            </button>
            <button 
              className="category-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category.id);
              }}
              aria-label={`Delete ${category.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="category-add-form">
          <div className="category-color-picker">
            {defaultColors?.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${newColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <div className="category-add-input-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Category name"
              className="category-input"
              autoFocus
            />
            <button type="submit" className="category-confirm" disabled={!newName.trim()}>
              <Check size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


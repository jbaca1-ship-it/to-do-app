import { User, LogOut, Menu, X } from 'lucide-react';
import { CategoryList } from '../categories/CategoryList';
import './Sidebar.css';

export function Sidebar({ 
  user,
  onLogout,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  defaultColors,
  isOpen,
  onToggle
}) {
  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="app-title">TaskFlow</h1>
        </div>

        <div className="sidebar-content">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => {
              onSelectCategory(id);
              if (window.innerWidth < 768) onToggle();
            }}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
            defaultColors={defaultColors}
          />
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.displayName || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
}


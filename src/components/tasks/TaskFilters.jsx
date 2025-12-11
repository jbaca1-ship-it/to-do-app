import { Search, Filter, X } from 'lucide-react';
import './TaskFilters.css';

export function TaskFilters({ 
  searchQuery, 
  onSearchChange,
  filters,
  onFilterChange,
  categories 
}) {
  const hasActiveFilters = filters.status !== 'all' || 
                           filters.priority !== 'all' || 
                           filters.dueDate !== 'all';

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      dueDate: 'all'
    });
  };

  return (
    <div className="task-filters">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <Filter size={16} />
          
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.dueDate}
            onChange={(e) => onFilterChange({ ...filters, dueDate: e.target.value })}
            className="filter-select"
          >
            <option value="all">Any Date</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
            <option value="overdue">Overdue</option>
            <option value="no-date">No Date</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import './TaskFilter.scss';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Все задачи' },
    { value: 'pending', label: 'Ожидание' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'done', label: 'Выполнено' }
  ];

  return (
    <div className="task-filter">
      <h4>Фильтр задач:</h4>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;

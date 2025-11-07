import React, { useState, useEffect } from 'react';
import { TaskForm } from '../../components/task-form';
import { TaskList } from '../../components/task-list';
import { TaskFilter } from '../../components/task-filter';
import { LoadingSpinner } from '../../components/loading-spinner';
import { useTasks } from '../../hooks/useTasks';
import './Tasks.scss';

const Tasks = () => {
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const {
    tasks,
    loading,
    createTask,
    deleteTask,
    loadTasks,
    toggleTimer,
    updateTaskStatus,
  } = useTasks();

  useEffect(() => {
    const filters = {};
    if (filter !== 'all') {
      filters.status = filter;
    }
    filters.skip = pagination.skip;
    filters.limit = pagination.limit;
    loadTasks(filters);
  }, [filter, pagination.skip, pagination.limit, loadTasks]);

  const addTask = async (title, description) => {
    const newTaskData = {
      title,
      description,
      status: 'pending',
      timer: {
        isRunning: false,
        startTime: null,
        totalTime: 0
      }
    };
    await createTask(newTaskData);
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTaskStatus(taskId, newStatus, task);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleToggleTimer = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await toggleTimer(taskId, task);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, skip: 0 }));
  };

  const handleLoadMore = () => {
    setPagination(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
  };

  const handleRefresh = () => {
    loadTasks({
      status: filter !== 'all' ? filter : undefined,
      ...pagination
    });
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Task Manager</h1>
        <div className="tasks-controls">
          <button
            onClick={handleRefresh}
            className="refresh-btn"
            disabled={loading}
          >
            🔄 Обновить
          </button>
        </div>
      </div>
      <TaskForm onAddTask={addTask} loading={loading} />
      <TaskFilter
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />
      {loading && <LoadingSpinner />}
      <TaskList
        tasks={tasks}
        onUpdateStatus={handleUpdateStatus}
        onDeleteTask={handleDeleteTask}
        onToggleTimer={handleToggleTimer}
        loading={loading}
      />
      {tasks.length > 0 && (
        <div className="pagination">
          <button
            onClick={handleLoadMore}
            className="load-more-btn"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить еще'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;

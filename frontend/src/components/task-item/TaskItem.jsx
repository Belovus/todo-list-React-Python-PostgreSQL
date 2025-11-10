import React, { useState } from 'react';
import './TaskItem.scss';

const TaskItem = ({ task, onUpdateStatus, onDeleteTask }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Ожидание',
      in_progress: 'В работе',
      done: 'Выполнено'
    };
    return statusMap[status];
  };

  const getStatusClass = (status) => {
    const classMap = {
      pending: 'status-pending',
      in_progress: 'status-in-progress',
      done: 'status-done'
    };
    return classMap[status];
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await onUpdateStatus(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`task-item ${getStatusClass(task.status)}`}>
      <div className="task-content">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {getStatusText(task.status)}
          </span>
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-actions">
          <div className="status-actions">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="status-select"
              disabled={updating || deleting}
            >
              <option value="pending">Ожидание</option>
              <option value="in_progress">В работе</option>
              <option value="done">Выполнено</option>
            </select>
          </div>
          <button
            onClick={handleDelete}
            className="delete-btn"
            disabled={deleting || updating}
            title="Удалить задачу"
          >
            {deleting ? '⏳' : '🗑️ Удалить'}
          </button>
        </div>
        {(updating || deleting) && (
          <div className="task-loading">
            {updating && 'Обновление...'}
            {deleting && 'Удаление...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

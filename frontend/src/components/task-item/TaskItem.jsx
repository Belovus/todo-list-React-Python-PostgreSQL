import React, { useState, useEffect } from 'react';
import './TaskItem.scss';

const TaskItem = ({ task, onUpdateStatus, onDeleteTask, onToggleTimer }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (task.timer.isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task.timer.isRunning]);

  const getTotalTime = () => {
    let total = task.timer.totalTime || 0;
    if (task.timer.isRunning && task.timer.startTime) {
      total += currentTime - task.timer.startTime;
    }
    return total;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const handleToggleTimer = async () => {
    setUpdating(true);
    try {
      await onToggleTimer(task.id);
    } catch (error) {
      console.error('Failed to toggle timer:', error);
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
        <div className="task-timer">
          <span className="timer-label">Затраченное время:</span>
          <span className="timer-value">{formatTime(getTotalTime())}</span>
        </div>
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
            <button
              onClick={handleToggleTimer}
              className={`timer-btn ${task.timer.isRunning ? 'stop' : 'start'}`}
              disabled={updating || deleting || task.status === 'done'}
            >
              {updating ? '⏳' : task.timer.isRunning ? '⏸️ Остановить' : '▶️ Запустить'}
            </button>
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

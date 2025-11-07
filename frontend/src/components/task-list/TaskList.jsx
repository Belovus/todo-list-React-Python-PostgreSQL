import React from 'react';
import { TaskItem } from '../task-item';
import './TaskList.scss';

const TaskList = ({ tasks, onUpdateStatus, onDeleteTask, onToggleTimer, loading }) => {
  if (tasks.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <h3>Задач пока нет</h3>
        <p>Добавьте первую задачу, чтобы начать работу</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDeleteTask={onDeleteTask}
          onToggleTimer={onToggleTimer}
        />
      ))}
    </div>
  );
};

export default TaskList;

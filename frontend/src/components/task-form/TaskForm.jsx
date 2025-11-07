import React, { useState } from 'react';
import './TaskForm.scss';

const TaskForm = ({ onAddTask, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && !submitting) {
      setSubmitting(true);
      try {
        await onAddTask(title.trim(), description.trim());
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Failed to create task:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const isDisabled = !title.trim() || submitting || loading;

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Добавить новую задачу</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Название задачи*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting || loading}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Описание задачи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          disabled={submitting || loading}
        />
      </div>
      <button
        type="submit"
        className="add-btn"
        disabled={isDisabled}
      >
        {submitting ? 'Добавление...' : 'Добавить задачу'}
      </button>
    </form>
  );
};

export default TaskForm;

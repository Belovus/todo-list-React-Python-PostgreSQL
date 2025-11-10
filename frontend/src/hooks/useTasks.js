import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi.js';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getTasks(filters);
      const tasksData = Array.isArray(response) ? response : response.tasks || [];
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, updateData);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, newStatus, currentTask) => {
    try {
      const updateData = { ...currentTask, status: newStatus };
      return await updateTask(taskId, updateData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    loadTasks,
    updateTaskStatus,
  };
};

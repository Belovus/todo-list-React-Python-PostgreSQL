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

  const toggleTimer = async (taskId, currentTask) => {
    const currentTime = Date.now();
    if (currentTask.timer.isRunning) {
      const elapsed = currentTime - currentTask.timer.startTime;
      const updatedTimer = {
        ...currentTask.timer,
        isRunning: false,
        totalTime: currentTask.timer.totalTime + elapsed,
        startTime: null
      };
      return await updateTask(taskId, {
        ...currentTask,
        timer: updatedTimer
      });
    } else {
      const updatedTimer = {
        ...currentTask.timer,
        isRunning: true,
        startTime: currentTime
      };
      return await updateTask(taskId, {
        ...currentTask,
        status: 'in_progress',
        timer: updatedTimer
      });
    }
  };

  const updateTaskStatus = async (taskId, newStatus, currentTask) => {
    const updateData = { ...currentTask, status: newStatus };
    if (newStatus === 'in_progress' && !currentTask.timer.isRunning) {
      updateData.timer = {
        ...currentTask.timer,
        isRunning: true,
        startTime: Date.now()
      };
    }
    if (currentTask.status === 'in_progress' && newStatus !== 'in_progress') {
      const currentTime = Date.now();
      const elapsed = currentTime - currentTask.timer.startTime;
      updateData.timer = {
        ...currentTask.timer,
        isRunning: false,
        totalTime: currentTask.timer.totalTime + elapsed,
        startTime: null
      };
    }
    return await updateTask(taskId, updateData);
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
    toggleTimer,
    updateTaskStatus,
  };
};

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { checkUpcomingDeadlines, requestNotificationPermission } from '../utils/notifications';

// Create context for task state management
const TaskContext = createContext();

// Available task categories
export const CATEGORIES = ['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other'];

// Priority levels with their display properties
export const PRIORITIES = {
  high: { label: 'High', color: 'red', order: 1 },
  medium: { label: 'Medium', color: 'yellow', order: 2 },
  low: { label: 'Low', color: 'green', order: 3 },
};

/**
 * Generate a unique ID for new tasks
 */
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * TaskProvider component - Wraps the app and provides task state
 */
export const TaskProvider = ({ children }) => {
  // Persist tasks and theme preference to localStorage
  const [tasks, setTasks] = useLocalStorage('todo_tasks', []);
  const [darkMode, setDarkMode] = useLocalStorage('todo_darkMode', false);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check for upcoming deadlines every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkUpcomingDeadlines(tasks);
    }, 60000);

    // Initial check
    checkUpcomingDeadlines(tasks);

    return () => clearInterval(interval);
  }, [tasks]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  /**
   * Add a new task
   */
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      category: taskData.category || 'Other',
      priority: taskData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  }, [tasks.length, setTasks]);

  /**
   * Update an existing task
   */
  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, [setTasks]);

  /**
   * Delete a task by ID
   */
  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  /**
   * Toggle task completion status
   */
  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      )
    );
  }, [setTasks]);

  /**
   * Reorder tasks after drag-and-drop
   */
  const reorderTasks = useCallback((startIndex, endIndex) => {
    setTasks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Update order property for all tasks
      return result.map((task, index) => ({ ...task, order: index }));
    });
  }, [setTasks]);

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  /**
   * Get task statistics for the progress tracker
   */
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  }, [tasks]);

  const value = {
    tasks,
    darkMode,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    toggleDarkMode,
    getStats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Custom hook to access task context
 */
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

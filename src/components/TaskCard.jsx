import React, { useState } from 'react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Flag,
  GripVertical,
  X,
  Save,
} from 'lucide-react';
import { useTasks, CATEGORIES, PRIORITIES } from '../context/TaskContext';

/**
 * TaskCard - Individual task display with edit/delete functionality
 */
const TaskCard = ({ task, provided }) => {
  const { toggleComplete, deleteTask, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || '',
    category: task.category,
    priority: task.priority,
  });

  // Format due date with relative labels
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  // Check if task is overdue
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed;

  // Get priority color classes
  const getPriorityClasses = () => {
    const colors = {
      high: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
      medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
      low: 'border-l-green-500 bg-green-50 dark:bg-green-900/10',
    };
    return colors[task.priority] || colors.medium;
  };

  // Handle save edit
  const handleSave = () => {
    if (editData.title.trim()) {
      updateTask(task.id, editData);
      setIsEditing(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || '',
      category: task.category,
      priority: task.priority,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-primary-300 dark:border-primary-600 p-4 animate-fade-in">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="datetime-local"
              value={editData.dueDate}
              onChange={(e) => setEditData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={editData.category}
              onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={editData.priority}
              onChange={(e) => setEditData((prev) => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(PRIORITIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={`task-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${getPriorityClasses()} border border-gray-200 dark:border-gray-700 p-4 ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...provided?.dragHandleProps}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(task.id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-primary-500 border-primary-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-gray-900 dark:text-white font-medium ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Category badge */}
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {task.category}
            </span>
            {/* Priority badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                task.priority === 'high'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              }`}
            >
              <Flag className="w-3 h-3" />
              {PRIORITIES[task.priority].label}
            </span>
            {/* Due date */}
            {task.dueDate && (
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                  isOverdue
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

import React from 'react';
import { TrendingUp, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

/**
 * ProgressTracker - Displays task completion statistics
 */
const ProgressTracker = () => {
  const { getStats } = useTasks();
  const stats = getStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Progress
        </h2>
        <span className="text-2xl font-bold text-primary-500">{stats.percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <ListTodo className="w-5 h-5 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Clock className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

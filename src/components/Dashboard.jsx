import React from 'react';
import { isToday, isFuture, parseISO } from 'date-fns';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

/**
 * Dashboard - Quick view cards for Today, Upcoming, and Completed tasks
 */
const Dashboard = ({ onViewChange, currentView }) => {
  const { tasks } = useTasks();

  // Calculate counts for each view
  const todayCount = tasks.filter(
    (t) => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))
  ).length;

  const upcomingCount = tasks.filter(
    (t) => !t.completed && t.dueDate && isFuture(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))
  ).length;

  const completedCount = tasks.filter((t) => t.completed).length;

  const views = [
    {
      id: 'today',
      label: "Today's Tasks",
      count: todayCount,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: upcomingCount,
      icon: Clock,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completedCount,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              isActive
                ? `${view.bgColor} ${view.borderColor} ring-2 ring-${view.color}-500/20`
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${view.bgColor}`}>
                <Icon className={`w-5 h-5 ${view.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold ${isActive ? view.iconColor : 'text-gray-900 dark:text-white'}`}>
                {view.count}
              </span>
            </div>
            <p className={`mt-2 text-sm font-medium ${
              isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {view.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default Dashboard;

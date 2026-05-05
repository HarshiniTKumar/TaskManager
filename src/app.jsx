import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskProvider } from './context/TaskContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProgressTracker from './components/ProgressTracker';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';

/**
 * Main App component
 */
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
  });

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress tracker */}
          <ProgressTracker />

          {/* Dashboard quick views */}
          <Dashboard currentView={currentView} onViewChange={setCurrentView} />

          {/* View title and add button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentView === 'all'
                ? 'All Tasks'
                : currentView === 'today'
                ? "Today's Tasks"
                : currentView === 'upcoming'
                ? 'Upcoming Tasks'
                : 'Completed Tasks'}
            </h2>
            <div className="flex items-center gap-2">
              {currentView !== 'all' && (
                <button
                  onClick={() => setCurrentView('all')}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  View All
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/30 transition-all font-medium shadow-lg shadow-primary-500/25"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <FilterBar filters={filters} setFilters={setFilters} />

          {/* Task list */}
          <TaskList filters={filters} currentView={currentView} />
        </main>

        {/* Add task modal */}
        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Floating action button for mobile */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center hover:bg-primary-600 transition-all"
          aria-label="Add task"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </TaskProvider>
  );
}

export default App;

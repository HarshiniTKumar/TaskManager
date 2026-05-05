import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { isToday, isFuture, parseISO } from 'date-fns';
import { Inbox } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';

/**
 * TaskList - Renders filtered tasks with drag-and-drop reordering
 */
const TaskList = ({ filters, currentView }) => {
  const { tasks, reorderTasks } = useTasks();

  // Filter tasks based on current filters and view
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply view filter first
    if (currentView === 'today') {
      result = result.filter(
        (t) => !t.completed && t.dueDate && isToday(parseISO(t.dueDate))
      );
    } else if (currentView === 'upcoming') {
      result = result.filter(
        (t) => !t.completed && t.dueDate && isFuture(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))
      );
    } else if (currentView === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Apply additional filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all' && currentView === 'all') {
      result = result.filter((t) =>
        filters.status === 'completed' ? t.completed : !t.completed
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sort by order property
    return result.sort((a, b) => a.order - b.order);
  }, [tasks, filters, currentView]);

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    reorderTasks(result.source.index, result.destination.index);
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No tasks found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {currentView === 'today'
            ? "You have no tasks due today"
            : currentView === 'upcoming'
            ? "No upcoming tasks scheduled"
            : currentView === 'completed'
            ? "No completed tasks yet"
            : "Add a new task to get started"}
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div className={snapshot.isDragging ? 'dragging' : ''}>
                    <TaskCard task={task} provided={provided} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;

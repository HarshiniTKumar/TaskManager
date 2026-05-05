/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Show a browser notification for a task reminder
 * @param {Object} task - The task object
 */
export const showTaskNotification = (task) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(`Task Reminder: ${task.title}`, {
      body: task.description || 'This task is due soon!',
      icon: '/favicon.ico',
      tag: task.id, // Prevents duplicate notifications
      requireInteraction: true,
    });

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

/**
 * Check for tasks due within the specified time window
 * @param {Array} tasks - Array of task objects
 * @param {number} minutesBefore - Minutes before due date to notify
 */
export const checkUpcomingDeadlines = (tasks, minutesBefore = 30) => {
  const now = new Date();
  const notificationWindow = minutesBefore * 60 * 1000; // Convert to milliseconds

  tasks.forEach((task) => {
    if (task.completed || !task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    const timeUntilDue = dueDate - now;

    // Notify if task is due within the window and hasn't been notified yet
    if (timeUntilDue > 0 && timeUntilDue <= notificationWindow) {
      const notifiedKey = `notified_${task.id}_${task.dueDate}`;
      if (!localStorage.getItem(notifiedKey)) {
        showTaskNotification(task);
        localStorage.setItem(notifiedKey, 'true');
      }
    }
  });
};

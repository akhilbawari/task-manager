import moment from 'moment';

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  
  // Use the exact date from backend without timezone conversion
  const date = moment(dateString);
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'day').startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');
  
  if (date.isSame(today, 'day')) {
    return `Today at ${date.format('h:mm A')}`;
  } else if (date.isSame(tomorrow, 'day')) {
    return `Tomorrow at ${date.format('h:mm A')}`;
  } else if (date.isSame(yesterday, 'day')) {
    return `Yesterday at ${date.format('h:mm A')}`;
  }
  
  return date.format('MMM D, YYYY h:mm A');
};

/**
 * Format a date as a relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  
  const date = moment(dateString);
  return date.fromNow();
};

/**
 * Get a color class for a priority level
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'P1':
      return 'bg-red-100 text-red-800';
    case 'P2':
      return 'bg-orange-100 text-orange-800';
    case 'P3':
      return 'bg-blue-100 text-blue-800';
    case 'P4':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get a human-readable priority label
 */
export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'P1':
      return 'Urgent';
    case 'P2':
      return 'High';
    case 'P3':
      return 'Medium';
    case 'P4':
      return 'Low';
    default:
      return 'Medium';
  }
};

import moment from 'moment';

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  
  try {
    return moment.utc(dateString).format("D MMM YYYY, h:mm A");
  } catch (error) {
    return "Invalid date";
  }
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

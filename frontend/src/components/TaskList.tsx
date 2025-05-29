import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { format, isToday, isTomorrow, isThisWeek, isAfter } from 'date-fns';
import { Calendar, Clock, Filter, X, CheckCircle, XCircle, Sparkles, AlignLeft, Bot, Edit } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted?: (taskId: string) => void;
  onTaskUpdated?: (task: Task) => void;
  selectedTasks?: string[];
  onTaskSelection?: (taskId: string) => void;
}

type FilterType = 'all' | 'today' | 'tomorrow' | 'this-week' | 'upcoming' | 'completed' | 'pending';

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskDeleted, 
  onTaskUpdated, 
  selectedTasks = [], 
  onTaskSelection 
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    applyFilters(activeFilter, searchQuery);
  }, [tasks, activeFilter, searchQuery]);

  const applyFilters = (filter: FilterType, query: string) => {
    let result = [...tasks];

    // Apply date filter
    if (filter !== 'all') {
      result = result.filter(task => {
        if (!task.dueDate) return filter === 'pending';
        
        const dueDate = new Date(task.dueDate);
        
        switch (filter) {
          case 'today':
            return isToday(dueDate);
          case 'tomorrow':
            return isTomorrow(dueDate);
          case 'this-week':
            return isThisWeek(dueDate) && !isToday(dueDate) && !isTomorrow(dueDate);
          case 'upcoming':
            return isAfter(dueDate, new Date()) && !isThisWeek(dueDate);
          case 'completed':
            return task.completed;
          case 'pending':
            return !task.completed;
          default:
            return true;
        }
      });
    }

    // Apply search query
    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        task => 
          task.name.toLowerCase().includes(lowerQuery) || 
          (task.assignee && task.assignee.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredTasks(result);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-50">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 pr-10 py-2 rounded-full border-2 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex overflow-x-auto p-2 bg-gray-50 border-b border-gray-100">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: 'Today' },
          { id: 'tomorrow', label: 'Tomorrow' },
          { id: 'this-week', label: 'This Week' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'pending', label: 'Pending' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id as FilterType)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap mr-2 ${
              activeFilter === filter.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="p-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'There are no tasks matching the selected filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div 
                key={task._id}
                className={`p-4 rounded-lg border ${
                  task.completed 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-white border-gray-200 hover:border-indigo-200'
                } ${
                  selectedTasks.includes(task._id) ? 'ring-2 ring-indigo-500' : ''
                } transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3">
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.name}
                        </h3>
                        {task.isAI && (
                          <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                            <Bot className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </div>
                      {task.assignee && (
                        <p className="text-sm text-gray-500 mt-1">
                          Assigned to: {task.assignee}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      {/* Action buttons in a single line */}
                      {onTaskUpdated && (
                        <button
                          onClick={() => onTaskUpdated({...task, completed: !task.completed})}
                          className={`p-1 rounded-full ${
                            task.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          } hover:bg-opacity-80`}
                          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {task.completed ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {onTaskSelection && (
                        <button
                          onClick={() => onTaskSelection(task._id)}
                          className="p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                          title="Edit task"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onTaskDeleted && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task?')) {
                              onTaskDeleted(task._id);
                            }
                          }}
                          className="p-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                          title="Delete task"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'P1' ? 'bg-red-100 text-red-800' :
                        task.priority === 'P2' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'P3' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDueDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {task.description && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-700 flex">
                      <AlignLeft className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p>{task.description}</p>
                        {task.isAI && (
                          <div className="flex items-center mt-2 text-xs text-purple-700">
                            <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                            <span>AI-enhanced description</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

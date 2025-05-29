import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import api from '../services/api';
import TaskInput from '../components/TaskInput';
import ManualTaskInput from '../components/ManualTaskInput';
import MeetingMinutesInput from '../components/MeetingMinutesInput';
import TaskList from '../components/TaskList';
import TaskStats from '../components/TaskStats';
import TaskAnalytics from '../components/TaskAnalytics';
import TranscriptInput from '../components/TranscriptInput';
import { Trash2, CheckSquare, X, AlertTriangle, Filter } from 'lucide-react';

// Define prop types for components to fix TypeScript errors
interface TaskInputProps {
  onTaskCreated: (task: Task) => void;
  onSubmit?: (taskString: string) => void;
  onPreview?: (taskString: string) => void;
}

interface ManualTaskInputProps {
  onTaskCreated: (task: Task) => void;
  onSubmit?: (taskData: any) => void;
}

interface TranscriptInputProps {
  onTasksCreated: (tasks: Task[]) => void;
  onSubmit?: (transcript: string) => void;
  onPreview?: (transcript: string) => void;
}

interface MeetingMinutesInputProps {
  onTasksCreated: (tasks: Task | Task[]) => void;
}

// Use type assertion with unknown to avoid TypeScript errors
const TypedTaskInput = TaskInput as unknown as React.ComponentType<TaskInputProps>;
const TypedManualTaskInput = ManualTaskInput as unknown as React.ComponentType<ManualTaskInputProps>;
const TypedTranscriptInput = TranscriptInput as unknown as React.ComponentType<TranscriptInputProps>;
const TypedMeetingMinutesInput = MeetingMinutesInput as unknown as React.ComponentType<MeetingMinutesInputProps>;

enum InputMode {
  NaturalLanguage = 'natural',
  Manual = 'manual',
  Transcript = 'transcript',
  MeetingMinutes = 'minutes'
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.NaturalLanguage);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    assignee: '',
    priority: '',
    dateRange: { start: null as string | null, end: null as string | null }
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'selected' | 'completed' | 'all'>('selected');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.getTasks();
      if (response.success) {
        setTasks(response.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTasks: Task | Task[]) => {
    if (Array.isArray(newTasks)) {
      setTasks(prevTasks => [...newTasks, ...prevTasks]);
      // Scroll to the task list section after creating tasks
      setTimeout(() => {
        document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      setTasks(prevTasks => [newTasks, ...prevTasks]);
      // Scroll to the task list section after creating a task
      setTimeout(() => {
        document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task._id));
    }
  };

  const handleDeleteTasks = async () => {
    let tasksToDelete: string[] = [];
    
    switch (deleteMode) {
      case 'selected':
        tasksToDelete = selectedTasks;
        break;
      case 'completed':
        tasksToDelete = tasks.filter(task => task.completed).map(task => task._id);
        break;
      case 'all':
        tasksToDelete = tasks.map(task => task._id);
        break;
    }
    
    if (tasksToDelete.length === 0) return;
    
    try {
      const response = await api.deleteMultipleTasks(tasksToDelete);
      
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(task => !tasksToDelete.includes(task._id)));
        setSelectedTasks([]);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting tasks:', error);
      setError('Failed to delete tasks');
    }
  };

  const applyFilters = (task: Task) => {
    const { assignee, priority, dateRange } = filterOptions;
    
    // Filter by assignee
    if (assignee && task.assignee !== assignee) {
      return false;
    }
    
    // Filter by priority
    if (priority && task.priority !== priority) {
      return false;
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      // Use type assertion to ensure TypeScript knows these are valid date strings
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      if (taskDate < startDate || taskDate > endDate) {
        return false;
      }
    }
    
    return true;
  };

  const filteredTasks = tasks.filter(applyFilters);
  
  // Get unique assignees for filter dropdown
  const assignees = Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean)));
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Task Creation Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Create Task</h2>
        
        {/* Input Mode Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 ${inputMode === InputMode.NaturalLanguage ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setInputMode(InputMode.NaturalLanguage)}
          >
            Natural Language
          </button>
          <button
            className={`px-4 py-2 ${inputMode === InputMode.Manual ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setInputMode(InputMode.Manual)}
          >
            Manual Input
          </button>
          <button
            className={`px-4 py-2 ${inputMode === InputMode.Transcript ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setInputMode(InputMode.Transcript)}
          >
            Meeting Transcript
          </button>
          <button
            className={`px-4 py-2 ${inputMode === InputMode.MeetingMinutes ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setInputMode(InputMode.MeetingMinutes)}
          >
            Meeting Minutes
          </button>
        </div>
        
        {/* Task Input Component based on mode */}
        {inputMode === InputMode.NaturalLanguage && (
          <TypedTaskInput onTaskCreated={handleTaskCreated} />
        )}
        
        {inputMode === InputMode.Manual && (
          <TypedManualTaskInput onTaskCreated={handleTaskCreated} />
        )}
        
        {inputMode === InputMode.Transcript && (
          <TypedTranscriptInput onTasksCreated={handleTaskCreated} />
        )}
        
        {inputMode === InputMode.MeetingMinutes && (
          <MeetingMinutesInput onTasksCreated={handleTaskCreated} />
        )}
      </div>
      
      {/* Task List Section */}
      <div id="task-list-section" className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage all your tasks in one place</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center text-sm"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 flex items-center text-sm"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
        </div>
        
        {/* Task Analytics - Positioned above task list */}
        {showAnalytics && (
          <div className="mb-6">
            <TaskAnalytics tasks={filteredTasks} />
          </div>
        )}
        
        {/* Task Stats */}
        <div className="mb-6">
          <TaskStats tasks={filteredTasks} />
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Tasks</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Assignee
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filterOptions.assignee}
                  onChange={(e) => setFilterOptions({...filterOptions, assignee: e.target.value})}
                >
                  <option value="">All Assignees</option>
                  {assignees.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filterOptions.priority}
                  onChange={(e) => setFilterOptions({...filterOptions, priority: e.target.value})}
                >
                  <option value="">All Priorities</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                  <option value="P4">P4</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => setFilterOptions({
                    ...filterOptions, 
                    dateRange: {...filterOptions.dateRange, start: e.target.value || null}
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => setFilterOptions({
                    ...filterOptions, 
                    dateRange: {...filterOptions.dateRange, end: e.target.value || null}
                  })}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setFilterOptions({
                    assignee: '',
                    priority: '',
                    dateRange: { start: null, end: null }
                  })}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Multiple Delete Options */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setDeleteMode('completed');
                setShowDeleteConfirm(true);
              }}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center text-sm"
              disabled={!tasks.some(t => t.completed)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Completed
            </button>
            <button
              onClick={() => {
                setDeleteMode('all');
                setShowDeleteConfirm(true);
              }}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center text-sm"
              disabled={tasks.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete All
            </button>
          </div>
          
          <div className="flex space-x-2">
            {selectedTasks.length > 0 && (
              <button
                onClick={() => {
                  setDeleteMode('selected');
                  setShowDeleteConfirm(true);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 flex items-center text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected ({selectedTasks.length})
              </button>
            )}
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              {selectedTasks.length === filteredTasks.length ? 'Unselect All' : 'Select All'}
            </button>
          </div>
        </div>
        
        {/* Bulk Actions - Shows when tasks are selected */}
        {selectedTasks.length > 0 && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
            <div className="text-sm text-indigo-700">
              <span className="font-medium">{selectedTasks.length}</span> task(s) selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTasks([])}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Selection
              </button>
            </div>
          </div>
        )}
        
        {/* Task Stats Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Completed</p>
            <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">In Progress</p>
            <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Due Today</p>
            <p className="text-2xl font-bold">
              {tasks.filter(t => {
                if (!t.dueDate) return false;
                const today = new Date().toDateString();
                const dueDate = new Date(t.dueDate).toDateString();
                return dueDate === today;
              }).length}
            </p>
          </div>
        </div>

        {/* Task List */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No tasks found. Create a new task to get started!</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTasks.map((task, index) => (
                <div key={task._id} className={`p-4 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => handleTaskSelection(task._id)}
                        className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.name}
                        </p>
                        {task.assignee && (
                          <span className="text-sm text-gray-500">Assigned to: {task.assignee}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.dueDate && (
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleTaskUpdated({ ...task, completed: !task.completed })}
                        className={`px-3 py-1 rounded text-sm ${task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {task.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => handleTaskDeleted(task._id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete task"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Confirm Deletion</h3>
            </div>
            
            <div className="mb-6">
              {deleteMode === 'selected' && (
                <p>Are you sure you want to delete {selectedTasks.length} selected task(s)?</p>
              )}
              {deleteMode === 'completed' && (
                <p>Are you sure you want to delete all completed tasks ({tasks.filter(t => t.completed).length} tasks)?</p>
              )}
              {deleteMode === 'all' && (
                <p>Are you sure you want to delete ALL tasks ({tasks.length} tasks)?</p>
              )}
              <p className="mt-2 text-sm text-red-600">This action cannot be undone.</p>
            </div>
            
            {deleteMode === 'all' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">Warning: You are about to delete all tasks in your task manager.</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setDeleteMode('selected');
                  }}
                  className={`px-3 py-1.5 rounded text-sm ${deleteMode === 'selected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Selected
                </button>
                <button
                  onClick={() => {
                    setDeleteMode('completed');
                  }}
                  className={`px-3 py-1.5 rounded text-sm ${deleteMode === 'completed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    setDeleteMode('all');
                  }}
                  className={`px-3 py-1.5 rounded text-sm ${deleteMode === 'all' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  All Tasks
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTasks}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;

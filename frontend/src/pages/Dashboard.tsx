import React, { useEffect, useState } from 'react';
import { Task } from '../types/Task';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskEditModal from '../components/TaskEditModal';
import TaskStats from '../components/TaskStats';
import CalendarView from '../components/CalendarView';
import TaskAnalytics from '../components/TaskAnalytics';
import TaskList from '../components/TaskList';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, ClipboardList, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Update filtered tasks when tasks or selected date changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toDateString();
      const filtered = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toDateString();
        return taskDate === dateStr;
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, selectedDate]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.getTasks();
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const clearDateFilter = () => {
    setSelectedDate(null);
    setFilteredTasks(tasks);
  };



  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await api.updateTask(taskId, updatedTask);
      toast.success('Task updated successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await api.updateTask(taskId, { completed });
      toast.success(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Task Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          View and manage your tasks with powerful analytics
        </p>
      </div>

      {/* Create Tasks Card */}
      <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-indigo-50 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-indigo-600" />
              Create New Tasks
            </h2>
            <p className="mt-1 text-gray-600">
              Add tasks using natural language, manual input, or extract them from meeting minutes
            </p>
          </div>
          <Link 
            to="/create"
            className="inline-flex items-center px-5 py-2.5 border-2 border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Tasks
          </Link>
        </div>
      </div>

      {/* Task Statistics */}
      <TaskStats tasks={tasks} />
      
      {/* Calendar View */}
      <CalendarView tasks={tasks} onDateSelect={handleDateSelect} />
      
      {/* Task Analytics */}
      <TaskAnalytics tasks={tasks} />


      <TaskEditModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateTask}
      />
    </div>
  );
};

export default Dashboard;

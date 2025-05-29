import React, { useState, useEffect } from 'react';
import { ParsedTask, Task } from '../types/Task';
import api from '../services/api';
import TaskInput from '../components/TaskInput';
import TranscriptInput from '../components/TranscriptInput';
import MeetingMinutesInput from '../components/MeetingMinutesInput';
import MultipleTasksInput from '../components/MultipleTasksInput';
import TabNavigation from '../components/TabNavigation';
import ManualTaskInput from '../components/ManualTaskInput';
import TaskList from '../components/TaskList';
import TaskEditModal from '../components/TaskEditModal';
import toast from 'react-hot-toast';
import { MessageSquare, Brain, List, Sparkles, Edit, FileText, ClipboardList, Plus, ListChecks } from 'lucide-react';

interface TaskCreationProps {
  onTasksCreated?: () => void;
}

const TaskCreation: React.FC<TaskCreationProps> = ({ onTasksCreated = () => {} }) => {
  const [activeTab, setActiveTab] = useState('ai-task');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useTranscriptParser, setUseTranscriptParser] = useState(false);
  


  // Preview functionality removed as requested

  const handleCreateTask = async (taskString: string, useTranscriptParser: boolean = false) => {
    try {
      if (useTranscriptParser) {
        // Use the transcript parser for natural language input
        await api.processTranscript(taskString);
        toast.success('Task created successfully using transcript parser');
      } else {
        // Use the regular task creation endpoint
        await api.createTask(taskString);
        toast.success('Task created successfully');
      }
      fetchTasks();
      onTasksCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };
  
  const handlePreviewTranscript = async (transcript: string): Promise<ParsedTask[]> => {
    try {
      const response = await api.parseTranscript(transcript);
      return response.data as ParsedTask[];
    } catch (error) {
      console.error('Error parsing transcript:', error);
      toast.error('Failed to parse transcript');
      return [];
    }
  };

  const handleProcessTranscript = async (transcript: string) => {
    try {
      const response = await api.processTranscript(transcript);
      toast.success(`${response.count} tasks created from transcript`);
      fetchTasks();
      onTasksCreated();
    } catch (error) {
      console.error('Error processing transcript:', error);
      toast.error('Failed to process transcript');
    }
  };
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);
  
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
  
  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await api.updateTask(taskId, updatedTask);
      toast.success('Task updated successfully');
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  const tabs = [
    {
      id: 'ai-task',
      label: 'Natural Language Task',
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: 'manual-task',
      label: 'Manual Task',
      icon: <Edit className="h-4 w-4" />
    },
    {
      id: 'meeting-minutes',
      label: 'Meeting Minutes',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Create Tasks</h1>
        <p className="mt-2 text-lg text-gray-600">
          Add tasks using natural language, manual input, or extract them from meeting minutes
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-50">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        
        <div className="p-8">
          {activeTab === 'ai-task' ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Natural Language Task Manager</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-700 font-medium">
                      Transform casual language into organized tasks with intelligent parsing and extraction.
                    </p>
                    <p className="text-gray-700 mt-2">
                      <span className="font-medium">Single task:</span> <span className="text-indigo-700">"Finish landing page Aman by 11pm 20th June P1"</span>
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Multiple tasks:</span> <span className="text-indigo-700">"Aman design homepage by Friday; Sarah write content by Thursday; John review by Monday"</span>
                    </p>
                  </div>
                </div>
              </div>

              <TaskInput onSubmit={(taskString) => handleCreateTask(taskString, true)} isAI={false} />
            </div>
          ) : activeTab === 'manual-task' ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Edit className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Manual Task Creation</h2>
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                <div className="flex items-start">
                  <div>
                    <p className="text-gray-700 font-medium">
                      Create tasks manually by filling out the form with specific details.
                    </p>
                  </div>
                </div>
              </div>
              <ManualTaskInput onSubmit={handleCreateTask} />
            </div>
          ) : activeTab === 'meeting-minutes' ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Extract Tasks from Meeting Minutes</h2>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100">
                <p className="text-gray-700">
                  Paste your meeting minutes below and our AI will analyze them to create meaningful tasks with proper assignments.
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-medium">Example:</span> <span className="text-purple-700">"Weekly team meeting: Discussed the new landing page design. Aman will finalize it by Friday. Rajeev needs to follow up with clients by Wednesday. Shreya should review the marketing materials before Thursday's presentation."</span>
                </p>
              </div>
              <MeetingMinutesInput onTasksCreated={onTasksCreated} />
            </div>
          ) : activeTab === 'multiple-tasks' ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ListChecks className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Create Multiple Tasks at Once</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <p className="text-gray-700">
                  Enter multiple tasks in a single prompt and Gemini AI will create separate tasks for each one with appropriate details.
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-medium">Example:</span> <span className="text-blue-700">"Aman design homepage by Friday; Sarah write content by Thursday; John review by Monday"</span>
                </p>
              </div>
              <MultipleTasksInput onTasksCreated={onTasksCreated} />
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Task List Section */}
      <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-50 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-indigo-600" />
            Your Tasks
          </h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tasks found</p>
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              onTaskDeleted={handleDeleteTask}
              onTaskUpdated={(task) => handleUpdateTask(task._id, { completed: task.completed })}
              onTaskSelection={handleEditTask}
            />
          )}
        </div>
      </div>
      
      <TaskEditModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateTask}
      />
    </div>
  );
};

export default TaskCreation;

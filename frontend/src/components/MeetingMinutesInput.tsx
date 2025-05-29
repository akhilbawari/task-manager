import React, { useState } from 'react';
import { ParsedTask } from '../types/Task';
import api from '../services/api';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils/dateUtils';
import { Brain, MessageSquare, Calendar, User, Sparkles, AlignLeft, Clock, Bot, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

import { Task } from '../types/Task';

interface MeetingMinutesInputProps {
  onTasksCreated: (tasks: Task | Task[]) => void;
}

const MeetingMinutesInput: React.FC<MeetingMinutesInputProps> = ({ onTasksCreated }) => {
  const [minutes, setMinutes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMinutes(e.target.value);
    setShowPreview(false);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutes.trim()) return;

    setIsLoading(true);
    setProcessStarted(true);
    try {
      toast.loading('Gemini AI is analyzing your meeting minutes...', { id: 'gemini-processing' });
      const response = await api.parseMeetingMinutes(minutes);
      
      // Make sure all tasks have isAI flag set to true
      const parsedWithAI = response.data.map((task: ParsedTask) => ({
        ...task,
        isAI: true,
        description: task.description || 'Generated from meeting minutes by Gemini AI'
      }));
      
      setParsedTasks(parsedWithAI);
      setShowPreview(true);
      toast.success(`Gemini AI found ${parsedWithAI.length} tasks in meeting minutes`, { id: 'gemini-processing' });
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to parse meeting minutes', { id: 'gemini-processing' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutes.trim()) return;

    setIsLoading(true);
    try {
      toast.loading('Creating AI-enhanced tasks...', { id: 'creating-tasks' });
      const response = await api.processMeetingMinutes(minutes);
      setMinutes('');
      setParsedTasks([]);
      setShowPreview(false);
      setProcessStarted(false);
      toast.success(`Created ${response.count} AI-enhanced tasks from meeting minutes`, { id: 'creating-tasks' });
      
      // Convert ParsedTask[] to Task[] by adding required fields
      const tasks: Task[] = (response.data || []).map(task => ({
        ...task,
        assignee: task.assignee || 'Unassigned', // Ensure assignee is never null
        _id: '', // This will be set by the backend
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      onTasksCreated(tasks);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create tasks from meeting minutes', { id: 'creating-tasks' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100 mb-4">
          <div className="flex items-start">
            <Bot className="h-6 w-6 text-purple-600 mr-2 mt-1" />
            <div>
              <h3 className="font-medium text-purple-900">Meeting Minutes Analysis with Gemini AI</h3>
              <p className="text-sm text-purple-700 mt-1">
                Paste your meeting minutes below and Gemini AI will analyze them to extract tasks, assign them to team members, set due dates, and generate descriptions.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="minutes" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FileText className="h-4 w-4 mr-1 text-gray-500" />
            Paste your meeting minutes
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-3 left-3 text-gray-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <textarea
              name="minutes"
              id="minutes"
              rows={8}
              value={minutes}
              onChange={handleInputChange}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Paste your meeting minutes here. Gemini AI will extract tasks, assignees, deadlines, and priorities."
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 flex items-start">
            <Sparkles className="h-4 w-4 text-purple-500 mr-1 mt-1" />
            <div>
              <p className="text-sm text-gray-700 font-medium">
                Gemini AI will extract detailed tasks with proper assignments and deadlines
              </p>
              <p className="text-sm text-gray-500 mt-1">
                AI will automatically generate meaningful titles and concise descriptions (max 250 chars) for each task
              </p>
            </div>
          </div>
        </div>

        {showPreview && parsedTasks.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center mb-3">
              <Bot className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Gemini AI Extracted Tasks:</h3>
              <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">{parsedTasks.length} tasks found</span>
            </div>
            <div className="space-y-4">
              {parsedTasks.map((task, index) => (
                <div key={index} className="bg-white p-4 rounded-md border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-gray-900">{task.name}</span>
                        <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                          <Bot className="h-3 w-3 mr-1" />
                          Gemini AI
                        </span>
                      </div>
                      {task.description && (
                        <div className="mb-3 flex items-start">
                          <AlignLeft className="h-3 w-3 text-gray-400 mr-1 mt-1" />
                          <div className="text-xs text-gray-600">
                            <p>{task.description}</p>
                            <div className="flex items-center mt-2 text-xs text-purple-700">
                              <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                              <span>AI-enhanced description</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {task.assignee || 'Unassigned'}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        <div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!minutes.trim() || isLoading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Bot className="h-4 w-4 mr-2" />
            Preview AI Tasks
          </button>
          <button
            type="submit"
            disabled={!minutes.trim() || isLoading || !showPreview}
            className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create AI Tasks
              </>
            )}
          </button>
        </div>
        
        {processStarted && !showPreview && !isLoading && (
          <div className="mt-4 bg-blue-50 text-blue-700 p-4 rounded-md border border-blue-100 flex items-start">
            <Bot className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Processing with Gemini AI</p>
              <p className="text-sm mt-1">The AI is analyzing your meeting minutes to extract tasks. Click "Preview AI Tasks" to see the results when ready.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MeetingMinutesInput;

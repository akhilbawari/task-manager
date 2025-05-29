import React, { useState } from 'react';
import { ParsedTask } from '../types/Task';
import api from '../services/api';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils/dateUtils';
import { Brain, MessageSquare, Calendar, User, Sparkles, AlignLeft, Clock, Bot, FileText, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';

import { Task } from '../types/Task';

interface MultipleTasksInputProps {
  onTasksCreated: (tasks: Task | Task[]) => void;
}

const MultipleTasksInput: React.FC<MultipleTasksInputProps> = ({ onTasksCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setShowPreview(false);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setProcessStarted(true);
    try {
      toast.loading('Gemini AI is analyzing your prompt for multiple tasks...', { id: 'gemini-processing' });
      const response = await api.parseMultipleTasks(prompt);
      
      // Make sure all tasks have isAI flag set to true
      const parsedWithAI = response.data.map((task: ParsedTask) => ({
        ...task,
        isAI: true,
        description: task.description || 'Generated from multiple tasks prompt by Gemini AI'
      }));
      
      setParsedTasks(parsedWithAI);
      setShowPreview(true);
      toast.success(`Gemini AI found ${parsedWithAI.length} tasks in your prompt`, { id: 'gemini-processing' });
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to parse multiple tasks', { id: 'gemini-processing' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      toast.loading('Creating multiple AI-enhanced tasks...', { id: 'creating-tasks' });
      const response = await api.processMultipleTasks(prompt);
      setPrompt('');
      setParsedTasks([]);
      setShowPreview(false);
      setProcessStarted(false);
      toast.success(`Created ${response.count} AI-enhanced tasks from your prompt`, { id: 'creating-tasks' });
      
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
      toast.error('Failed to create multiple tasks', { id: 'creating-tasks' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-4">
          <div className="flex items-start">
            <Bot className="h-6 w-6 text-blue-600 mr-2 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900">Multiple Tasks Creation with Gemini AI</h3>
              <p className="text-sm text-blue-700 mt-1">
                Enter a prompt with multiple tasks and Gemini AI will create separate tasks for each one, complete with assignees, due dates, and descriptions.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="prompt" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <ListChecks className="h-4 w-4 mr-1 text-blue-500" />
            Multiple Tasks Prompt
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={5}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter multiple tasks, e.g.: 'Aman design homepage by Friday; Sarah write content by Thursday; John review by Monday'"
            value={prompt}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {showPreview && parsedTasks.length > 0 && (
          <div className="bg-white border border-blue-100 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-blue-900">
                  Gemini AI found {parsedTasks.length} tasks in your prompt
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {parsedTasks.map((task, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-800">{index + 1}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                          </div>
                        </div>
                      </div>
                      {task.description && (
                        <div className="pl-7 mt-1">
                          <AlignLeft className="h-3 w-3 text-gray-400 mr-1 mt-1" />
                          <div className="text-xs text-gray-600">
                            <p>{task.description}</p>
                            <div className="flex items-center mt-2 text-xs text-blue-700">
                              <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                              <span>AI-enhanced description</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-7">
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
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!prompt.trim() || isLoading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Bot className="h-4 w-4 mr-2" />
            Preview AI Tasks
          </button>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading || !showPreview}
            className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
              <p className="text-sm mt-1">The AI is analyzing your prompt to extract multiple tasks. Click "Preview AI Tasks" to see the results when ready.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MultipleTasksInput;

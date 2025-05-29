import React, { useState } from 'react';
import { ParsedTask } from '../types/Task';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils/dateUtils';
import { SplitSquareHorizontal, ListChecks, Sparkles, AlignLeft, Brain, User, Calendar, AlertCircle } from 'lucide-react';

interface TaskInputProps {
  onSubmit: (taskString: string) => Promise<void>;
  isAI?: boolean;
}

const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isAI = true }) => {
  const [taskString, setTaskString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedTask | null>(null);
  const [parsedPreviews, setParsedPreviews] = useState<ParsedTask[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isMultiTask, setIsMultiTask] = useState(true);
  const [multiTaskDetected, setMultiTaskDetected] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTaskString(value);
    setShowPreview(false);
    
    // Check if input likely contains multiple tasks
    const containsMultipleTasks = 
      value.includes(';') || 
      value.includes('\n') || 
      value.includes('1)') || 
      value.includes('2)') || 
      value.includes('- ') || 
      value.includes('• ');
    
    setMultiTaskDetected(containsMultipleTasks);
    
    // If multiple tasks are detected, automatically switch to multi-task mode
    if (containsMultipleTasks) {
      setIsMultiTask(true);
    }
  };

  // Preview functionality removed as requested

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskString.trim()) return;

    setIsLoading(true);
    try {
      // If this is an AI task, send the raw string
      // If not, we'd need to handle it differently, but that's done in the parent component
      await onSubmit(taskString);
      setTaskString('');
      setParsedPreview(null);
      setShowPreview(false);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="taskString" className="block text-sm font-medium text-gray-700">
              {isMultiTask ? 'Enter multiple tasks (one per line or separated by semicolons)' : 'Enter your task in natural language'}
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsMultiTask(false)}
                className={`p-1.5 rounded-md ${!isMultiTask ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Single Task Mode"
              >
                <ListChecks size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsMultiTask(true)}
                className={`p-1.5 rounded-md ${isMultiTask ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Multiple Tasks Mode"
              >
                <SplitSquareHorizontal size={16} />
              </button>
              <div className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </div>
            </div>
          </div>
          
          {multiTaskDetected && !isMultiTask && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-center text-sm text-amber-700">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span>Multiple tasks detected. Switch to multi-task mode for better results.</span>
              <button 
                type="button" 
                className="ml-2 underline" 
                onClick={() => setIsMultiTask(true)}
              >
                Switch now
              </button>
            </div>
          )}
          
          <div className="mt-1 flex rounded-md shadow-sm">
            {isMultiTask ? (
              <textarea
                name="taskString"
                id="taskString"
                value={taskString}
                onChange={handleInputChange}
                rows={5}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g.\n- Call client Rajeev tomorrow 5pm\n- Submit report P1 by Friday\n- Finish landing page Aman by 11pm 20th June"
                disabled={isLoading}
              />
            ) : (
              <input
                type="text"
                name="taskString"
                id="taskString"
                value={taskString}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. Finish landing page Aman by 11pm 20th June"
                disabled={isLoading}
              />
            )}
          </div>
          <div className="mt-2 flex items-start">
            <Sparkles className="h-4 w-4 text-indigo-500 mr-1 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium">
                {isMultiTask ? 
                  'Enter multiple tasks separated by new lines, semicolons, or bullet points.' : 
                  'Try phrases like "Call client Rajeev tomorrow 5pm" or "Submit report P1 by Friday"'}
              </p>
              {/* Line about AI generating titles and descriptions removed as requested */}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {isMultiTask ? `Preview (${parsedPreviews.length} tasks):` : 'Preview:'}
            </h3>
            
            {isMultiTask ? (
              <div className="space-y-4">
                {parsedPreviews.map((task, index) => (
                  <div key={index} className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-900">{task.name}</span>
                          <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Enhanced
                          </span>
                        </div>
                        {task.description && (
                          <div className="mb-3 flex items-start">
                            <AlignLeft className="h-3 w-3 text-gray-400 mr-1 mt-1" />
                            <p className="text-xs text-gray-600">{task.description}</p>
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
            ) : parsedPreview ? (
              <div className="bg-white p-4 rounded-md border border-indigo-100 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900">{parsedPreview.name}</span>
                      <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Enhanced
                      </span>
                    </div>
                    {parsedPreview.description && (
                      <div className="mb-3 flex items-start">
                        <AlignLeft className="h-3 w-3 text-gray-400 mr-1 mt-1" />
                        <p className="text-xs text-gray-600">{parsedPreview.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        {parsedPreview.assignee || 'Unassigned'}
                      </div>
                      {parsedPreview.dueDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(parsedPreview.dueDate)}
                        </div>
                      )}
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(parsedPreview.priority)}`}>
                          {getPriorityLabel(parsedPreview.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={!taskString.trim() || isLoading}
            className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
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
                <Brain className="h-4 w-4 mr-2" />
                {isMultiTask ? 'Create Tasks' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;

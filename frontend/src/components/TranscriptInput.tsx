import React, { useState } from 'react';
import { ParsedTask } from '../types/Task';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils/dateUtils';
import { Brain, MessageSquare, Calendar, User, Sparkles, AlignLeft } from 'lucide-react';

interface TranscriptInputProps {
  onSubmit: (transcript: string) => Promise<void>;
  onPreview: (transcript: string) => Promise<ParsedTask[]>;
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({ onSubmit, onPreview }) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    setShowPreview(false);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    setIsLoading(true);
    try {
      const parsed = await onPreview(transcript);
      
      // Make sure all tasks have isAI flag set to true
      const parsedWithAI = parsed.map(task => ({
        ...task,
        isAI: true,
        description: 'Extracted from meeting transcript'
      }));
      
      setParsedTasks(parsedWithAI);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(transcript);
      setTranscript('');
      setParsedTasks([]);
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
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1">
            Paste your meeting transcript
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-3 left-3 text-gray-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <textarea
              name="transcript"
              id="transcript"
              rows={5}
              value={transcript}
              onChange={handleInputChange}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="e.g. Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 flex items-start">
            <Sparkles className="h-4 w-4 text-purple-500 mr-1 mt-1" />
            <div>
              <p className="text-sm text-gray-700 font-medium">
                Paste your meeting transcript and our AI will extract all tasks with assignees and deadlines
              </p>
              <p className="text-sm text-gray-500 mt-1">
                AI will automatically generate meaningful titles and descriptions for each task based on the context
              </p>
            </div>
          </div>
        </div>

        {showPreview && parsedTasks.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
            <div className="flex items-center mb-3">
              <Brain className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">AI-Extracted Tasks:</h3>
            </div>
            <div className="space-y-4">
              {parsedTasks.map((task, index) => (
                <div key={index} className="bg-white p-4 rounded-md border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
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
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!transcript.trim() || isLoading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Brain className="h-4 w-4 mr-2" />
            Preview Tasks
          </button>
          <button
            type="submit"
            disabled={!transcript.trim() || isLoading}
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
                <Brain className="h-4 w-4 mr-2" />
                Create Tasks
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TranscriptInput;

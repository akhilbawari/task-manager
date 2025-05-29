import React, { useState } from 'react';
import { Task } from '../types/Task';
import { formatDate, getPriorityColor, getPriorityLabel } from '../utils/dateUtils';
import { Edit, Trash2, Sparkles, ChevronDown, ChevronUp, AlignLeft } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">{task.name}</h3>
            {task.isAI && (
              <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <p className="text-gray-600">Assigned to: {task.assignee}</p>
            <p className="text-gray-600">
              Due: {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            </p>
            <div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-indigo-500"
            title="Edit"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Description section */}
      {task.description && (
        <div className="mt-3">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <AlignLeft className="h-4 w-4 mr-1" />
            Description {expanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>
          {expanded && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              {task.description}
            </div>
          )}
        </div>
      )}
      
      {/* Completion checkbox */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id, !task.completed)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="ml-2 text-sm text-gray-600">
          {task.completed ? 'Completed' : 'Mark as complete'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

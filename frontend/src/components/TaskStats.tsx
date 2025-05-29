import React from 'react';
import { Task } from '../types/Task';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Count tasks by priority
  const priorityCounts = {
    'P1': tasks.filter(task => task.priority === 'P1').length,
    'P2': tasks.filter(task => task.priority === 'P2').length,
    'P3': tasks.filter(task => task.priority === 'P3').length,
    'P4': tasks.filter(task => task.priority === 'P4').length,
  };
  
  // Count tasks by assignee (top 5)
  const assigneeCounts: Record<string, number> = {};
  tasks.forEach(task => {
    const assignee = task.assignee || 'Unassigned';
    assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1;
  });
  
  const topAssignees = Object.entries(assigneeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueTodayTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Task Completion Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Completion Rate</span>
            <span className="text-xs font-medium text-gray-500">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tasks Status Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
              <span className="text-gray-600">Pending: {pendingTasks}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-1"></span>
              <span className="text-gray-600">Due Today: {dueTodayTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Priority Distribution</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm text-gray-600 flex-1">P1 (Urgent)</span>
            <span className="text-sm font-medium">{priorityCounts.P1}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-sm text-gray-600 flex-1">P2 (High)</span>
            <span className="text-sm font-medium">{priorityCounts.P2}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm text-gray-600 flex-1">P3 (Medium)</span>
            <span className="text-sm font-medium">{priorityCounts.P3}</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600 flex-1">P4 (Low)</span>
            <span className="text-sm font-medium">{priorityCounts.P4}</span>
          </div>
        </div>
      </div>

      {/* Top Assignees Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Top Assignees</h3>
        <div className="space-y-2">
          {topAssignees.map(([assignee, count], index) => (
            <div key={assignee} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                {assignee.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm text-gray-600 flex-1">{assignee}</span>
              <span className="text-sm font-medium">{count} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStats;

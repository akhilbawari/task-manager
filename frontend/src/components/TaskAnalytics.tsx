import React, { useMemo } from 'react';
import { Task } from '../types/Task';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format, isToday, isTomorrow, isThisWeek, isAfter, isBefore, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Brain, Calendar, CheckSquare, Clock } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface TaskAnalyticsProps {
  tasks: Task[];
}

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  // Calculate task statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    // Priority breakdown
    const p1Count = tasks.filter(task => task.priority === 'P1').length;
    const p2Count = tasks.filter(task => task.priority === 'P2').length;
    const p3Count = tasks.filter(task => task.priority === 'P3').length;
    const p4Count = tasks.filter(task => task.priority === 'P4').length;
    
    // Due date breakdown
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isBefore(new Date(task.dueDate), new Date()) && !isToday(new Date(task.dueDate));
    }).length;
    
    const dueToday = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isToday(new Date(task.dueDate));
    }).length;
    
    const dueTomorrow = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isTomorrow(new Date(task.dueDate));
    }).length;
    
    const dueThisWeek = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isThisWeek(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !isTomorrow(new Date(task.dueDate));
    }).length;
    
    const dueLater = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isAfter(new Date(task.dueDate), endOfWeek(new Date()));
    }).length;
    
    // Tasks by assignee
    const assignees = tasks.reduce((acc, task) => {
      const assignee = task.assignee || 'Unassigned';
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Tasks by day of week (for current week)
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const daysOfWeek = eachDayOfInterval({ start, end });
    
    const tasksByDay = daysOfWeek.map(day => {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return format(dueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      }).length;
    });
    
    return {
      total,
      completed,
      pending,
      completion: total ? Math.round((completed / total) * 100) : 0,
      priorities: { p1: p1Count, p2: p2Count, p3: p3Count, p4: p4Count },
      dueDates: { overdue, today: dueToday, tomorrow: dueTomorrow, thisWeek: dueThisWeek, later: dueLater },
      assignees,
      tasksByDay,
      daysOfWeek
    };
  }, [tasks]);
  
  // Chart data for task status
  const statusData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['rgba(72, 187, 120, 0.7)', 'rgba(237, 137, 54, 0.7)'],
        borderColor: ['rgb(72, 187, 120)', 'rgb(237, 137, 54)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for priorities
  const priorityData = {
    labels: ['P1 (Urgent)', 'P2 (High)', 'P3 (Medium)', 'P4 (Low)'],
    datasets: [
      {
        data: [stats.priorities.p1, stats.priorities.p2, stats.priorities.p3, stats.priorities.p4],
        backgroundColor: [
          'rgba(245, 101, 101, 0.7)',
          'rgba(237, 137, 54, 0.7)',
          'rgba(246, 224, 94, 0.7)',
          'rgba(72, 187, 120, 0.7)',
        ],
        borderColor: [
          'rgb(245, 101, 101)',
          'rgb(237, 137, 54)',
          'rgb(246, 224, 94)',
          'rgb(72, 187, 120)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for due dates
  const dueDateData = {
    labels: ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later'],
    datasets: [
      {
        data: [
          stats.dueDates.overdue,
          stats.dueDates.today,
          stats.dueDates.tomorrow,
          stats.dueDates.thisWeek,
          stats.dueDates.later,
        ],
        backgroundColor: [
          'rgba(245, 101, 101, 0.7)',
          'rgba(237, 137, 54, 0.7)',
          'rgba(246, 224, 94, 0.7)',
          'rgba(72, 187, 120, 0.7)',
          'rgba(99, 179, 237, 0.7)',
        ],
        borderColor: [
          'rgb(245, 101, 101)',
          'rgb(237, 137, 54)',
          'rgb(246, 224, 94)',
          'rgb(72, 187, 120)',
          'rgb(99, 179, 237)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for weekly distribution
  const weeklyData = {
    labels: stats.daysOfWeek.map(day => format(day, 'EEE')),
    datasets: [
      {
        label: 'Tasks Due',
        data: stats.tasksByDay,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
  
  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tasks Due This Week',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  // Get top assignees (up to 5)
  const topAssignees = Object.entries(stats.assignees)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-50 mb-8">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center">
        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
          <Brain className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Task Analytics</h2>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-indigo-100">
          <div className="flex items-center mb-2">
            <div className="bg-indigo-100 p-1.5 rounded-md mr-2">
              <CheckSquare className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Completion</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-indigo-700">{stats.completion}%</span>
            <span className="ml-2 text-xs text-gray-500">({stats.completed}/{stats.total} tasks)</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 p-1.5 rounded-md mr-2">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Due Today</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-green-700">{stats.dueDates.today}</span>
            <span className="ml-2 text-xs text-gray-500">tasks</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center mb-2">
            <div className="bg-amber-100 p-1.5 rounded-md mr-2">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">This Week</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-amber-700">
              {stats.dueDates.today + stats.dueDates.tomorrow + stats.dueDates.thisWeek}
            </span>
            <span className="ml-2 text-xs text-gray-500">tasks</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center mb-2">
            <div className="bg-red-100 p-1.5 rounded-md mr-2">
              <Clock className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Overdue</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-red-700">{stats.dueDates.overdue}</span>
            <span className="ml-2 text-xs text-gray-500">tasks</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Task Status</h3>
          <div className="h-64">
            <Pie data={statusData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Task Priorities</h3>
          <div className="h-64">
            <Pie data={priorityData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Due Date Distribution</h3>
          <div className="h-64">
            <Pie data={dueDateData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Weekly Task Distribution</h3>
          <div className="h-64">
            <Bar data={weeklyData} options={barChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Top Assignees */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Top Assignees</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topAssignees.map(([assignee, count]) => (
            <div key={assignee} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mb-2">
                  {assignee.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-sm font-medium text-gray-700 truncate w-full text-center">{assignee}</h4>
                <p className="text-xs text-gray-500">{count} tasks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;

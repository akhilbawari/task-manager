import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isToday, isTomorrow, isThisWeek, isAfter, isBefore } from 'date-fns';
import { Task } from '../types/Task';
import { Brain, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './calendar-custom.css'; // We'll create this file for custom calendar styling

interface CalendarViewProps {
  tasks: Task[];
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // State for task statistics
  const [stats, setStats] = useState({
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    upcoming: 0,
    overdue: 0
  });

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      const dateStr = new Date(task.dueDate).toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);
  
  // Calculate task statistics
  useEffect(() => {
    const today = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isToday(new Date(task.dueDate));
    }).length;
    
    const tomorrow = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isTomorrow(new Date(task.dueDate));
    }).length;
    
    const thisWeek = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isThisWeek(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !isTomorrow(new Date(task.dueDate));
    }).length;
    
    const upcoming = tasks.filter(task => {
      if (!task.dueDate) return false;
      return isAfter(new Date(task.dueDate), new Date()) && !isThisWeek(new Date(task.dueDate));
    }).length;
    
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return isBefore(new Date(task.dueDate), new Date()) && !isToday(new Date(task.dueDate));
    }).length;
    
    setStats({ today, tomorrow, thisWeek, upcoming, overdue });
  }, [tasks]);

  // Handle date change
  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      onDateSelect(value);
    }
  };

  // Custom tile content to show task count and status
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      const tasksOnDate = tasksByDate[dateStr] || [];
      
      // Check if date is today, in the past, or has tasks
      const isDateToday = isToday(date);
      const isDatePast = isBefore(date, new Date()) && !isDateToday;
      const hasCompletedTasks = tasksOnDate.some(task => task.completed);
      const hasOverdueTasks = isDatePast && tasksOnDate.some(task => !task.completed);
      
      if (tasksOnDate.length > 0) {
        return (
          <div className="calendar-tile-content">
            <div className={`task-indicator ${hasOverdueTasks ? 'overdue' : hasCompletedTasks ? 'completed' : ''}`}>
              {tasksOnDate.length}
            </div>
          </div>
        );
      } else if (isDateToday) {
        return (
          <div className="calendar-tile-content">
            <div className="today-indicator"></div>
          </div>
        );
      }
    }
    return null;
  };
  
  // Custom tile class name
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      const tasksOnDate = tasksByDate[dateStr] || [];
      const isDateToday = isToday(date);
      const isDatePast = isBefore(date, new Date()) && !isDateToday;
      const hasOverdueTasks = isDatePast && tasksOnDate.some(task => !task.completed);
      
      let classes = 'calendar-tile';
      if (isDateToday) classes += ' today';
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) classes += ' selected';
      if (hasOverdueTasks) classes += ' has-overdue';
      if (tasksOnDate.length > 0) classes += ' has-tasks';
      
      return classes;
    }
    return '';
  };

  // Get tasks for selected date
  const tasksForSelectedDate = tasksByDate[selectedDate.toDateString()] || [];
  
  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-50 mb-8">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Task Calendar</h2>
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'MMMM yyyy')}
        </div>
      </div>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
        <div className="flex flex-col items-center py-2 px-3 rounded-lg bg-white shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Today</div>
          <div className="text-lg font-semibold text-indigo-600">{stats.today}</div>
        </div>
        <div className="flex flex-col items-center py-2 px-3 rounded-lg bg-white shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Tomorrow</div>
          <div className="text-lg font-semibold text-blue-600">{stats.tomorrow}</div>
        </div>
        <div className="flex flex-col items-center py-2 px-3 rounded-lg bg-white shadow-sm">
          <div className="text-xs text-gray-500 mb-1">This Week</div>
          <div className="text-lg font-semibold text-green-600">{stats.thisWeek}</div>
        </div>
        <div className="flex flex-col items-center py-2 px-3 rounded-lg bg-white shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Upcoming</div>
          <div className="text-lg font-semibold text-purple-600">{stats.upcoming}</div>
        </div>
        <div className="flex flex-col items-center py-2 px-3 rounded-lg bg-white shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Overdue</div>
          <div className="text-lg font-semibold text-red-600">{stats.overdue}</div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="calendar-container mb-6">
          <Calendar 
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
                onDateSelect(value);
              }
            }} 
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="custom-calendar rounded-lg border-0 shadow-sm w-full"
            nextLabel={<span className="calendar-nav-button">›</span>}
            prevLabel={<span className="calendar-nav-button">‹</span>}
            next2Label={null}
            prev2Label={null}
          />
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Tasks for {formatDateForDisplay(selectedDate)}
            </h3>
          </div>
          
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No tasks scheduled for this date</p>
              <button 
                onClick={() => onDateSelect(new Date())}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                View today's tasks
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <div 
                  key={task._id} 
                  className={`p-4 rounded-lg border ${task.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200'} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3">
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.name}
                        </h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'P1' ? 'bg-red-100 text-red-800' :
                          task.priority === 'P2' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'P3' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </div>
                      </div>
                      
                      {task.assignee && (
                        <p className="text-sm text-gray-500 mt-1">Assigned to: {task.assignee}</p>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), 'h:mm a')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

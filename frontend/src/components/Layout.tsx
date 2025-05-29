import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, Info, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <div className="flex flex-shrink-0 items-center">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Smart Task Manager</span>
              </div>
              <nav className="ml-10 flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
                    isActive('/create') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Task
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              {/* GitHub icon removed as requested */}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-indigo-100 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1.5 rounded">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Smart Task Manager</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AI-Powered Task Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

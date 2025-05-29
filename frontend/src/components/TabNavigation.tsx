import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
      <nav className="flex space-x-2 py-3" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-2 px-4 rounded-full font-medium text-sm flex items-center transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-indigo-700'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className={`mr-2 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500'}`}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;

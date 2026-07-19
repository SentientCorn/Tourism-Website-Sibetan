import React from 'react';
import { RefreshCw } from 'lucide-react';

const AdminTabs = ({ tabs, activeTab, setActiveTab, onRefresh, loading }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-3 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold text-sm transition-all ${
              isActive 
                ? 'bg-white text-[#1B3461] border-t-2 border-l border-r border-[#1B3461] shadow-xs cursor-pointer' 
                : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button 
        onClick={onRefresh} 
        title="Reload Data"
        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
    </div>
  );
};

export default AdminTabs;

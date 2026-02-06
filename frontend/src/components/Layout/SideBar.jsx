import React from 'react';
import { 
  StickyNote, Star, Hash, PushPin, Trash2, 
  Settings, LogOut, User as UserIcon 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'all', label: 'All Notes', icon: <StickyNote size={20} /> },
    { id: 'pinned', label: 'Pinned', icon: <PushPin size={20} /> },
    { id: 'favorites', label: 'Favorites', icon: <Star size={20} /> },
    { id: 'tags', label: 'Tags', icon: <Hash size={20} /> },
    { id: 'trash', label: 'Trash', icon: <Trash2 size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors">
      <div className="p-6">
        <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white"><StickyNote size={20} /></div>
          MindVault
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === item.id 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <UserIcon size={20} /> Profile
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
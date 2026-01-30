import React, { useState } from 'react';
import { Plus, Search, LogOut, StickyNote, Hash, Settings, LayoutGrid, X } from 'lucide-react';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([
    { id: 1, title: 'Project Ideas', content: 'Build a MERN stack notes app with advanced UI.', date: 'Jan 30' },
  ]);

  // Handle adding a new note (Local state for now)
  const handleAddNote = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    setNotes([newNote, ...notes]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Sidebar - Change "NoteIt" to your chosen name here */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
          <StickyNote size={28} /> NoteFlow
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold">
                <LayoutGrid size={20} /> All Notes
            </button>
            {/* ... other buttons ... */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none dark:text-white" />
          </div>
          {/* Button to open Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} /> New Note
          </button>
        </header>

        {/* Notes Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div key={note.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{note.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{note.content}</p>
                <div className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{note.date}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* NEW NOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black dark:text-white">Create New Note</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddNote} className="space-y-4">
              <input 
                name="title"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none dark:text-white font-bold text-lg" 
                placeholder="Note Title" 
              />
              <textarea 
                name="content"
                required
                rows="5"
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none dark:text-white resize-none" 
                placeholder="Write your thoughts..."
              ></textarea>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all">
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
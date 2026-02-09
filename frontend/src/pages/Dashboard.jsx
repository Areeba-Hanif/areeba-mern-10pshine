import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, LogOut, StickyNote, LayoutGrid, X, 
  Sun, Moon, Trash2, Loader2, Download, Star, Edit3, 
  Filter, CheckCircle2, Eye, FileUp, History, RotateCcw, 
  FileText, Clock, Pin, SortAsc, ArrowDownAZ, ArrowUpAZ,
  User, Settings, ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { jsPDF } from "jspdf";
import axios from 'axios';
import SettingsPage from './SettingsPage'; // Ensure path is correct

const CATEGORIES = ['Work', 'Personal', 'Ideas', 'Important', 'Urgent'];

const Dashboard = () => {

  const [userData, setUserData] = useState(null);
  const { isDark, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Data States
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('notes'); // 'notes' or 'settings'
  
  // UI Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All', 'Trash', 'Favorites', or Category
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'az', 'za'
  
  // Editor States
  const [editingNote, setEditingNote] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [noteTag, setNoteTag] = useState('Personal');

useEffect(() => {

  const initDashboard = async () => {
    setLoading(true);
    try {
      // Fetch both in parallel for speed
      const [notesRes, userRes] = await Promise.all([
        api.get('/notes'),
        api.get('/auth/me')
      ]);
      
      if (notesRes.data.success) setNotes(notesRes.data.data);
      if (userRes.data.success) setUserData(userRes.data.user);
    } catch (error) {
      toast.error("Session expired");
      handleLogout();
    } finally {
      setLoading(false);
    }
  };
  initDashboard();
}, []);

const calculateNoteStats = (html) => {
  if (!html) return { words: 0, time: 0 };

  // Clean HTML tags and entities in one pass
  const cleanText = html
    .replace(/<[^>]*>/g, '') 
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200) || 1; // Default to 1 min if there's text
  
  return { words: wordCount, time: readingTime };
};


const handleRestore = async (e, note) => {
  e.stopPropagation();
  try {
    const res = await api.put(`/notes/${note._id}`, { isDeleted: false });
    setNotes(notes.map(n => n._id === note._id ? res.data.data : n));
    toast.success("Note restored");
  } catch (error) {
    toast.error("Restore failed");
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };



const handleDownloadPDF = (note) => {
  const doc = new jsPDF();
  
  // 1. Properly clean HTML and special characters (&nbsp;, etc.)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = note.content;
  const cleanText = tempDiv.textContent || tempDiv.innerText || "";

  // 2. Set Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(note.title, 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Date: ${new Date(note.createdAt).toLocaleDateString()}`, 20, 28);
  doc.line(20, 32, 190, 32);

  // 3. Setup Text Wrap and Multi-page logic
  doc.setFontSize(11);
  doc.setTextColor(0);
  const splitText = doc.splitTextToSize(cleanText, 170);
  
  let yPosition = 40;
  const pageHeight = 280; // A4 height limit

  // 4. Loop through lines and add pages if needed
  splitText.forEach((line) => {
    if (yPosition > pageHeight) {
      doc.addPage();
      yPosition = 20; // Reset Y on new page
    }
    doc.text(line, 20, yPosition);
    yPosition += 7; // Line spacing
  });

  // 5. Final Save
  doc.save(`${note.title.replace(/\s+/g, '_')}.pdf`);
  toast.success("PDF generated clearly!");
};
  // --- ACTIONS ---

  const handleSaveNote = async (e) => {
    e.preventDefault();
    const payload = { title, content, tags: [noteTag] };
    try {
      if (editingNote) {
        const res = await api.put(`/notes/${editingNote._id}`, payload);
        setNotes(notes.map(n => n._id === editingNote._id ? res.data.data : n));
        toast.success("Note updated");
      } else {
        const res = await api.post('/notes', payload);
        setNotes([res.data.data, ...notes]);
        toast.success("Note created");
      }
      closeModal();
    } catch (error) { toast.error("Save failed"); }
  };

  // Move to Trash (Soft Delete)
  const handleMoveToTrash = async (e, note) => {
    e.stopPropagation();
    try {
      const res = await api.put(`/notes/${note._id}`, { isDeleted: true });
      setNotes(notes.map(n => n._id === note._id ? res.data.data : n));
      toast.success("Moved to Trash");
    } catch (error) { toast.error("Action failed"); }
  };

const handleTogglePin = async (e, note) => {
  e.stopPropagation();
  
  try {
    // 1. Use your 'api' instance instead of 'axios'
const res = await api.put(`/notes/${note._id}`, { 
  isPinned: !note.isPinned 
});
// Use the response data or the toggled value for the toast
const newPinStatus = !note.isPinned;
toast.success(newPinStatus ? "Note pinned" : "Note unpinned");
    // 3. Update the state using the data returned from the server
    setNotes(notes.map(n => n._id === note._id ? res.data.data : n));
    
   
  } catch (error) {
    console.error("Pin Error:", error);
    toast.error("Action failed");
  }
};


  const handlePermanentDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete forever? This cannot be undone.")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success("Deleted permanently");
    } catch (error) { toast.error("Delete failed"); }
  };

  const handleToggleFavorite = async (e, note) => {
    e.stopPropagation();
    try {
      const res = await api.put(`/notes/${note._id}`, { isFavorite: !note.isFavorite });
      setNotes(notes.map(n => n._id === note._id ? res.data.data : n));
    } catch (error) { toast.error("Error updating favorite"); }
  };

const { pinnedNotes, regularNotes } = React.useMemo(() => {
  const filtered = notes.filter(note => {
    const matchesSearch = (note.title + note.content).toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'Trash') return matchesSearch && note.isDeleted;
    if (note.isDeleted) return false;
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Favorites') return matchesSearch && note.isFavorite;
    return matchesSearch && note.tags?.includes(selectedFilter);
  });

  // Sort function to reuse
  const sorter = (a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'za') return b.title.localeCompare(a.title);
    return 0;
  };

  return {
    pinnedNotes: filtered.filter(n => n.isPinned).sort(sorter),
    regularNotes: filtered.filter(n => !n.isPinned).sort(sorter)
  };
}, [notes, searchQuery, selectedFilter, sortBy]);



const NoteCard = ({ note }) => (
  <div 
    key={note._id} 
    className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 flex flex-col shadow-sm hover:shadow-xl transition-all w-full min-h-[250px]"
  >
    {/* Card Header */}
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
        {note.tags?.[0] || 'Note'}
      </span>

      {!note.isDeleted && (
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => handleTogglePin(e, note)}
            className={`p-2 rounded-lg transition-all ${note.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'}`}
          >
            <Pin size={18} fill={note.isPinned ? "currentColor" : "none"} className={note.isPinned ? "-rotate-45" : ""} />
          </button>

          <button 
            onClick={(e) => handleToggleFavorite(e, note)} 
            className={`p-2 rounded-lg transition-all ${note.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400 opacity-0 group-hover:opacity-100'}`}
          >
            <Star size={20} fill={note.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      )}
    </div>

    {/* Clickable Body */}
    <div onClick={() => { setViewNote(note); setIsViewModalOpen(true); }} className="cursor-pointer flex-1">
      <h3 className="text-xl font-bold mb-2 line-clamp-1 text-slate-900 dark:text-white">{note.title}</h3>
      <div className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: note.content }} />
    </div>

    {/* Card Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
      <div className="flex gap-1">
        {note.isDeleted ? (
          <>
            <button onClick={(e) => handleRestore(e, note)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl"><RotateCcw size={18} /></button>
            <button onClick={(e) => handlePermanentDelete(e, note._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
          </>
        ) : (
          <>
            <button onClick={() => openEditModal(note)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl"><Edit3 size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDownloadPDF(note); }} className="p-2 text-slate-400 hover:text-blue-600 rounded-xl"><Download size={18} /></button>
            <button onClick={(e) => handleMoveToTrash(e, note)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button>
          </>
        )}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {new Date(note.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);


  // --- IMPORT FUNCTIONALITY ---
  const handleImportClick = () => fileInputRef.current.click();

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const res = await api.post('/notes', { 
          title: file.name.replace(/\.[^/.]+$/, ""), 
          content: content,
          tags: ['Personal'] 
        });
        setNotes([res.data.data, ...notes]);
        toast.success("File imported as note!");
      } catch (err) { toast.error("Import failed"); }
    };
    reader.readAsText(file);
  };

  // --- MODAL CONTROLS ---
  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setNoteTag(note.tags?.[0] || 'Personal');
    setIsModalOpen(true);
    setIsViewModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };


  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".txt,.md" />

      {/* Sidebar */}
{/* Sidebar */}
<aside className="w-64 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col bg-white dark:bg-slate-900 hidden lg:flex">
  
  {/* 1. Header (Fixed at top) */}
  <div className="flex items-center gap-3 mb-10">
    <div className="bg-indigo-600 p-2 rounded-xl text-white">
      <StickyNote size={24} />
    </div>
    <h1 className="text-xl font-black tracking-tight">BrainDump</h1>
  </div>

  {/* 2. Scrollable Navigation Area */}
<nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
  {/* MAIN FILTERS */}
  <button 
    onClick={() => {
      setSelectedFilter('All');
      setCurrentView('notes'); // Return to dashboard
    }} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      selectedFilter === 'All' && currentView === 'notes' 
      ? 'bg-indigo-600 text-white shadow-lg' 
      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <LayoutGrid size={20} /> All Notes
  </button>
  
  <button 
    onClick={() => {
      setSelectedFilter('Favorites');
      setCurrentView('notes'); // Return to dashboard
    }} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      selectedFilter === 'Favorites' && currentView === 'notes' 
      ? 'bg-amber-500 text-white shadow-lg' 
      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Star size={20} /> Favorites
  </button>
  
  <button 
    onClick={() => {
      setSelectedFilter('Trash');
      setCurrentView('notes'); // Return to dashboard
    }} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      selectedFilter === 'Trash' && currentView === 'notes' 
      ? 'bg-red-500 text-white shadow-lg' 
      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Trash2 size={20} /> Trash
  </button>

  {/* SORTING SECTION (No changes needed here as sorting stays on the current view) */}
  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
    <span className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort Order</span>
    <div className="mt-2 grid grid-cols-2 gap-1 px-2"> 
      {[
        { id: 'newest', label: 'New', icon: <Clock size={16} /> },
        { id: 'oldest', label: 'Old', icon: <SortAsc size={16} /> },
        { id: 'az', label: 'A-Z', icon: <ArrowDownAZ size={16} /> },
        { id: 'za', label: 'Z-A', icon: <ArrowUpAZ size={16} /> },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setSortBy(item.id)}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all border ${
            sortBy === item.id 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  </div>

  {/* CATEGORIES SECTION */}
  <div className="pt-6 pb-2 px-4 flex items-center justify-between">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</span>
  </div>
  
  <div className="space-y-1">
    {CATEGORIES.map(cat => (
      <button 
        key={cat} 
        onClick={() => {
          setSelectedFilter(cat);
          setCurrentView('notes'); // Return to dashboard when a category is clicked
        }} 
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          selectedFilter === cat && currentView === 'notes'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:translate-x-1'
        }`}
      >
        <div className={`h-2 w-2 rounded-full transition-all ${
          (selectedFilter === cat && currentView === 'notes') ? 'bg-indigo-600 scale-125' : 'bg-slate-300'
        }`} /> 
        {cat}
      </button>
    ))}
  </div>
</nav>
  {/* 3. Bottom Actions (Pinned to bottom) */}
  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
    <button onClick={handleImportClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold transition-all">
      <FileUp size={20} /> Import Note
    </button>

    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-all">
      <LogOut size={20} /> Logout
    </button>
  </div>
</aside>

      {/* Main Content */}
<main className="flex-1 min-h-screen flex flex-col pt-0">
<header className="w-full h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 px-8 flex items-center justify-between">  <div className="relative w-96">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
    <input 
      type="text"
      placeholder="Search your brain dump..."
      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* Right: Actions & Profile */}
  <div className="flex items-center gap-4">
    <button 
      onClick={() => toggleTheme(!isDark)}
      className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>

    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

    {/* New Profile Dropdown */}
    <div className="group relative">
      <button className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
        <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          {userData?.name?.charAt(0) || <User size={20} />}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{userData?.name || 'User'}</p>
          <p className="text-[10px] text-slate-400 font-medium">Pro Account</p>
        </div>
        <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
      </button>

      {/* Hover Dropdown Menu */}
      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
        <div className="w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-2">
          <button onClick={() => setCurrentView('settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
            <Settings size={18} /> Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>

    <button 
      onClick={() => setIsModalOpen(true)}
      className="ml-2 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
    >
      <Plus size={20} />
      <span className="hidden sm:inline">New Note</span>
    </button>
  </div>
</header>

 {/* Content Section */}
 {/* Content Section */}
<div className="p-8 w-full overflow-y-auto">
  {/* 1. CHECK IF WE ARE IN SETTINGS VIEW */}
  {currentView === 'settings' ? (
    <SettingsPage 
      userData={userData} 
      isDark={isDark} 
      toggleTheme={toggleTheme} 
      onBack={() => setCurrentView('notes')} 
    />
  ) : (
    /* 2. IF NOT SETTINGS, SHOW LOADING OR NOTES */
    <>
      {loading ? (
        <div className="flex justify-center py-20 text-indigo-600">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (pinnedNotes.length === 0 && regularNotes.length === 0) ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-40 opacity-40 w-full text-center">
          <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-full mb-4">
            <StickyNote size={48} />
          </div>
          <p className="text-xl font-bold capitalize">No notes found in {selectedFilter}</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        /* Notes Grid */
        <div className="space-y-12 w-full">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
                <Pin size={18} className="-rotate-45" fill="currentColor" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Pinned Notes</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {pinnedNotes.map(note => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            </section>
          )}

          {/* Regular Notes Section (Add your regularNotes.map here) */}
          {regularNotes.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-50">Others</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {regularNotes.map(note => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  )}
</div></main>
     
{/* VIEW MODAL (READ ONLY) */}
{isViewModalOpen && viewNote && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-sm">
    {/* Main Modal Box */}
    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
      
      {/* 1. HEADER (Title & Close) */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-start">
        <div className="flex-1">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black uppercase rounded-lg mb-3 inline-block">
            {viewNote.tags?.[0] || 'Note'}
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {viewNote.title}
          </h2>
        </div>
        <button 
          onClick={() => setIsViewModalOpen(false)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={24} className="text-slate-500" />
        </button>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-8 md:px-12 py-4 custom-scrollbar">
        <div 
          className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: viewNote.content }} 
        />
      </div>

  {/* 3. FOOTER (Last Sync) */}
<div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap justify-between items-center gap-4">
  
  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
    <History size={16} /> 
    <span>Last Sync: {new Date(viewNote.updatedAt || viewNote.createdAt).toLocaleDateString()}</span>
  </div>

  <div className="flex items-center gap-4 text-slate-400 font-bold text-sm uppercase tracking-widest">
    {/* Calling the new combined function using viewNote.content */}
    {(() => {
      const stats = calculateNoteStats(viewNote.content);
      return (
        <>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <FileText size={16} className="text-indigo-500" />
            <span>{stats.words} Words</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold">
            <Clock size={14} className="text-emerald-500" />
            <span>{stats.time} Min Read</span>
          </div>
        </>
      );
    })()}
  </div>
  
  <button 
    onClick={() => handleDownloadPDF(viewNote)}
    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md"
  >
    <Download size={16} />
    Download PDF
  </button>
</div>

    </div>
  </div>
)}

{/* EDITOR MODAL */}

{isModalOpen && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col">
      
      {/* Header */}
      <div className="p-8 pb-4 border-b dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note Title..." className="flex-1 text-3xl md:text-4xl font-black bg-transparent outline-none dark:text-white" required />
          <select value={noteTag} onChange={(e) => setNoteTag(e.target.value)} className="bg-slate-100 dark:bg-slate-800 px-6 py-2 rounded-2xl font-bold outline-none cursor-pointer text-indigo-600">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Scrollable Editor */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-slate-900">
        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" placeholder="Write something brilliant..." />
      </div>

      {/* FIXED FOOTER WITH WORD COUNT */}
{/* FIXED FOOTER WITH COMBINED STATS */}
<div className="p-8 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap justify-between items-center gap-4">
  
  <div className="flex items-center gap-4 text-slate-400 font-bold text-sm uppercase tracking-widest">
    {(() => {
      {/* We use 'content' here because it's the live state from ReactQuill */}
      const stats = calculateNoteStats(content);
      return (
        <>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <FileText size={16} className="text-indigo-500" />
            <span>{stats.words} Words</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold uppercase tracking-tighter">
            <Clock size={14} className="text-emerald-500" />
            <span>{stats.time} Min Read</span>
          </div>
        </>
      );
    })()}
  </div>

  <div className="flex items-center gap-6">
    <button 
      type="button" 
      onClick={closeModal} 
      className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
    >
      Cancel
    </button>
    <button 
      type="submit" 
      onClick={handleSaveNote} 
      className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
    >
      <CheckCircle2 size={20} /> 
      {editingNote ? 'Update Note' : 'Create Note'}
    </button>
  </div>
</div>
    </div>
  </div>
)}


    </div>
    
  );

};

export default Dashboard;
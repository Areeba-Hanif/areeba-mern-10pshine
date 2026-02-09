import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Theme
import { X, Save } from 'lucide-react';

const NoteEditor = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent outline-none dark:text-white w-full"
            placeholder="Note Title..."
          />
          <div className="flex gap-2">
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            className="h-[80%] dark:text-white"
            placeholder="Start typing your ideas..."
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ title, content })}
            className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Save size={18} /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
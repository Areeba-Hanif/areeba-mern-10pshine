import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { X, Save } from 'lucide-react';

const NoteEditor = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  // --- NEW: QUILL CONFIGURATION ---
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],                       // IMAGE & VIDEO SUPPORT
      ['clean']                                         // remove formatting button
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'video', 
    'color', 'background', 'blockquote', 'code-block'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent outline-none dark:text-white w-full"
            placeholder="Note Title..."
          />
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 custom-quill-container">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            formats={formats}
            className="h-full dark:text-white"
            placeholder="Write something legendary..."
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ title, content })}
            className="px-8 py-2.5 rounded-xl font-bold bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Save size={18} /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
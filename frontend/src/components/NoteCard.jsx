// import React from 'react';
// import { Pin, Star, Trash2, Edit3, Calendar } from 'lucide-react';
// import moment from 'moment'; // Ensure moment is installed: npm install moment

// const NoteCard = ({ note, onTogglePin, onToggleFavorite, onDelete, onEdit }) => {
//   return (
//     <div className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
//       note.isPinned 
//         ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' 
//         : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
//     }`}>
      
//       {/* Action Buttons (Top Right) */}
//       <div className="flex gap-2 mb-4 justify-end">
//         <button 
//           onClick={(e) => onTogglePin(e, note)}
//           className={`p-1.5 rounded-lg transition-colors ${
//             note.isPinned 
//               ? 'bg-indigo-600 text-white' 
//               : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
//           }`}
//           title={note.isPinned ? "Unpin Note" : "Pin Note"}
//         >
//           <Pin size={16} className={note.isPinned ? "" : "-rotate-45"} />
//         </button>
//       </div>

//       {/* Note Content */}
//       <div onClick={() => onEdit(note)} className="cursor-pointer">
//         <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">
//           {note.title || "Untitled Note"}
//         </h3>
//         <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-4 mb-4">
//           {note.content}
//         </p>
//       </div>

//       {/* Footer Info */}
//       <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
//         <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
//           <Calendar size={12} />
//           {moment(note.createdAt).format('MMM DD, YYYY')}
//         </div>

//         {/* Tags */}
//         <div className="flex gap-1">
//           {note.tags?.slice(0, 2).map((tag, idx) => (
//             <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-full text-slate-500 uppercase tracking-tight">
//               #{tag}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteCard;
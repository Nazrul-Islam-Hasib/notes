import React, { useState, useEffect } from 'react';
import type { Note } from '../types/Note';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onBack?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete, onArchive, onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<{title?: string, content?: string}>({});

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
      setErrors({});
    } else {
      setTitle('');
      setContent('');
      setTags('');
      setErrors({});
    }
  }, [note]);

  const handleSave = () => {
    const newErrors: {title?: string, content?: string} = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (note) {
      onSave({
        ...note,
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        lastEdited: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100 text-base-content/30 italic">
        Select a note to view or create a new one.
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-base-100 p-4 md:p-8 overflow-y-auto ${!note ? 'hidden md:flex' : 'flex'}`}>
      <div className="md:hidden mb-4">
        <button onClick={onBack} className="btn btn-ghost btn-sm gap-2 pl-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Go Back
        </button>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-6">
         <div className="flex-1">
            <input 
              type="text" 
              placeholder="Note Title" 
              className={`text-3xl font-bold bg-transparent border-none outline-none w-full mb-2 ${errors.title ? 'placeholder-error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="text-error text-xs block mb-2">{errors.title}</span>}
            
            <div className="flex items-center gap-4 text-sm text-base-content/60">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                    <span>Tags</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Dev, React, Recipes..." 
                  className="bg-transparent border-none outline-none flex-1 text-base-content"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4 text-sm text-base-content/60 mt-2">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Last edited</span>
                </div>
                <span>{note.lastEdited}</span>
            </div>
         </div>
         <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <button 
              onClick={handleSave}
              className="btn btn-outline btn-sm gap-2 justify-start min-w-[140px] flex-1 lg:flex-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Note
            </button>
            <button 
              onClick={() => onArchive(note.id)}
              className="btn btn-outline btn-sm gap-2 justify-start min-w-[140px] flex-1 lg:flex-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
              {note.isArchived ? 'Unarchive' : 'Archive Note'}
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="btn btn-outline btn-error btn-sm gap-2 justify-start min-w-[140px] flex-1 lg:flex-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              Delete Note
            </button>
         </div>
      </div>

      <div className="divider"></div>

      <textarea 
        className={`flex-1 bg-transparent border-none outline-none resize-none text-lg leading-relaxed ${errors.content ? 'placeholder-error' : ''}`}
        placeholder="Start typing your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {errors.content && <span className="text-error text-xs mt-2">{errors.content}</span>}
    </div>
  );
};

export default NoteEditor;

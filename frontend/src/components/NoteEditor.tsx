import React, { useState, useEffect } from 'react';
import type { Note } from '../types/Note';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTag, faClock, faFloppyDisk, faBoxArchive, faTrash } from '@fortawesome/free-solid-svg-icons';

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
          <FontAwesomeIcon icon={faChevronLeft} />
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
                    <FontAwesomeIcon icon={faTag} />
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
                    <FontAwesomeIcon icon={faClock} />
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
              <FontAwesomeIcon icon={faFloppyDisk} />
              Save Note
            </button>
            <button 
              onClick={() => onArchive(note.id)}
              className="btn btn-outline btn-sm gap-2 justify-start min-w-[140px] flex-1 lg:flex-none"
            >
              <FontAwesomeIcon icon={faBoxArchive} />
              {note.isArchived ? 'Unarchive' : 'Archive Note'}
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="btn btn-outline btn-error btn-sm gap-2 justify-start min-w-[140px] flex-1 lg:flex-none"
            >
              <FontAwesomeIcon icon={faTrash} />
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

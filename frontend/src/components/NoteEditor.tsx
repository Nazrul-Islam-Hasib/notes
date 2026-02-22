import React, { useState, useEffect } from 'react';
import type { Note } from '../types/Note';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTag, faClock, faFloppyDisk, faBoxArchive, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

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

  const handleCancel = () => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
      setErrors({});
    }
  };

  if (!note) {
    return (
      <div className="hidden flex-1 md:flex items-center justify-center bg-base-100 text-base-content/30 italic">
        Select a note to view or create a new one.
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-base-100 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8 pt-18 md:pt-8 ${!note ? 'hidden md:flex' : 'flex'}`}>
      {/* Mobile header with back button and actions */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button onClick={onBack} className="btn btn-ghost btn-sm gap-2 pl-0">
          <FontAwesomeIcon icon={faChevronLeft} />
          <span className="sm:inline">Go Back</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => onDelete(note.id)}
            className="btn btn-ghost btn-sm btn-circle"
            title="Delete Note"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button 
            onClick={() => onArchive(note.id)}
            className="btn btn-ghost btn-sm btn-circle"
            title={note.isArchived ? 'Unarchive' : 'Archive Note'}
          >
            <FontAwesomeIcon icon={faBoxArchive} />
          </button>
          <button 
            onClick={handleCancel}
            className="btn btn-outline btn-sm"
            title="Cancel"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="btn btn-outline btn-primary btn-sm"
            title="Save Note"
          >
            Save
          </button>
        </div>
      </div>

      {/* Title and metadata */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-6">
         <div className="flex-1 w-full">
            <input 
              type="text" 
              placeholder="Note Title" 
              className={`text-2xl md:text-3xl font-bold bg-transparent border-none outline-none w-full mb-2 ${errors.title ? 'placeholder-error' : ''}`}
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
         
         {/* Desktop action buttons - archive and delete only */}
         <div className="hidden md:flex flex-col gap-2">
            <button 
              onClick={() => onArchive(note.id)}
              className="btn btn-outline btn-sm gap-2 justify-start min-w-35"
            >
              <FontAwesomeIcon icon={faBoxArchive} />
              <span className="hidden md:inline">{note.isArchived ? 'Unarchive' : 'Archive Note'}</span>
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="btn btn-outline btn-error btn-sm gap-2 justify-start min-w-35"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="hidden md:inline">Delete Note</span>
            </button>
         </div>
      </div>

      <div className="divider"></div>

      {/* Text editor */}
      <textarea 
        className={`flex-1 bg-transparent border-none outline-none resize-none text-lg min-h-50 ${errors.content ? 'placeholder-error' : ''}`}
        placeholder="Start typing your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {errors.content && <span className="text-error text-xs mt-2">{errors.content}</span>}

      {/* Desktop save/cancel buttons at bottom */}
      <div className="hidden md:block">
        <div className="divider"></div>
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            className="btn btn-primary btn-sm gap-2"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            <span className="hidden md:inline">Save Note</span>
          </button>
          <button 
            onClick={handleCancel}
            className="btn btn-outline btn-error btn-sm gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span className="hidden md:inline">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;

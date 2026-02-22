import React from 'react';
import type { Note } from '../types/Note';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  showMobileSearch?: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote, showMobileSearch }) => {
  return (
    <div className={`w-full md:w-80 border-r border-base-200 flex flex-col bg-base-100 pb-16 md:pb-0 ${showMobileSearch ? 'pt-28' : 'pt-14'} md:pt-0 relative ${selectedNoteId ? 'hidden md:flex' : 'flex'}`}>
      {/* Create New Note Button - Desktop/Tablet */}
      <div className="hidden md:block p-4 border-b border-base-200">
        <button 
          onClick={onCreateNote}
          className="btn btn-primary w-full gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Create New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-base-content/50 italic">
            No notes found.
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`p-4 border-b border-base-200 cursor-pointer hover:bg-base-200 transition-colors ${selectedNoteId === note.id ? 'bg-base-200' : ''}`}
            >
              <h3 className="font-bold text-lg mb-1 truncate">{note.title || "Untitled Note"}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map(tag => (
                  <span key={tag} className="badge badge-sm bg-base-300 text-base-content border-none">{tag}</span>
                ))}
              </div>
              <span className="text-xs text-base-content/60">{note.lastEdited}</span>
            </div>
          ))
        )}
      </div>

      {/* Mobile Floating Create Button - only visible when NoteList is shown */}
      <button 
        onClick={onCreateNote}
        className="md:hidden fixed bottom-20 right-4 btn btn-primary btn-circle btn-lg shadow-lg z-40"
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
    </div>
  );
};

export default NoteList;

import React from 'react';
import type { Note } from '../types/Note';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote }) => {
  return (
    <div className={`w-full md:w-80 border-r border-base-200 flex flex-col bg-base-100 ${selectedNoteId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b border-base-200">
        <button 
          onClick={onCreateNote}
          className="btn btn-primary w-full gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create New Note
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
    </div>
  );
};

export default NoteList;

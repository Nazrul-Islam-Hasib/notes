import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import type { Note } from './types/Note';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import { createNoteService } from './services/noteService';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const { isAuthenticated, isLoading: authLoading, user, token, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'archived' | string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const noteService = useMemo(
    () => createNoteService(token, user?.id ?? null),
    [token, user?.id]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch notes from API
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotes();
    }
  }, [isAuthenticated, user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await noteService.getAllNotes();
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  const filteredNotes = notes.filter(note => {
    const matchesTab = 
      activeTab === 'all' ? !note.isArchived :
      activeTab === 'archived' ? note.isArchived :
      note.tags.includes(activeTab);
    
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId) || null;

  const handleCreateNote = async () => {
    try {
      const newNote = await noteService.createNote({
        title: 'New Note',
        tags: [],
        content: 'Add content to your note here.',
        lastEdited: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        isArchived: false,
      });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
      toast.success('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      const saved = await noteService.updateNote(updatedNote.id, updatedNote);
      setNotes(notes.map(n => n.id === saved.id ? saved : n));
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleArchiveNote = async (id: string) => {
    try {
      const updated = await noteService.toggleArchive(id);
      setNotes(notes.map(n => n.id === id ? updated : n));
      toast.success(updated.isArchived ? 'Note archived!' : 'Note unarchived!');
    } catch (error) {
      console.error('Error archiving note:', error);
      toast.error('Failed to archive note');
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'all') return 'All Notes';
    if (activeTab === 'archived') return 'Archived Notes';
    return `Notes Tagged: ${activeTab}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-base-200 text-base-content overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <Sidebar
        tags={allTags} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedNoteId(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onThemeChange={setTheme}
        onLogout={logout}
        userEmail={user?.email}
        onMobileSearchChange={setShowMobileSearch}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={getHeaderTitle()}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onThemeChange={setTheme}
          onLogout={logout}
          userEmail={user?.email}
          hideSearch={!!selectedNoteId}
        />
        
        <div className="flex-1 flex min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <NoteList 
                notes={filteredNotes} 
                selectedNoteId={selectedNoteId} 
                onSelectNote={(note) => setSelectedNoteId(note.id)}
                onCreateNote={handleCreateNote}
                showMobileSearch={showMobileSearch}
              />
              <NoteEditor 
                note={selectedNote}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
                onArchive={handleArchiveNote}
                onBack={() => setSelectedNoteId(null)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

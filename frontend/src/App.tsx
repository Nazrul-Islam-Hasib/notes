import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import type { Note } from './types/Note';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import Header from './components/Header';

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'React Performance Optimization',
    tags: ['Dev', 'React'],
    content: 'Key performance optimization techniques:\n\n1. Code Splitting\n- Use React.lazy() for route-based splitting\n- Implement dynamic imports for heavy components\n\n2. Memoization\n- useMemo for expensive calculations\n- useCallback for function props\n- React.memo for component optimization',
    lastEdited: '29 Oct 2024',
    isArchived: false,
  },
  {
    id: '2',
    title: 'Japan Travel Planning',
    tags: ['Travel', 'Personal'],
    content: 'Places to visit:\n- Tokyo (Shibuya, Shinjuku)\n- Kyoto (Fushimi Inari, Kinkaku-ji)\n- Osaka (Dotonbori, Osaka Castle)',
    lastEdited: '28 Oct 2024',
    isArchived: false,
  },
  {
    id: '3',
    title: 'Favorite Pasta Recipes',
    tags: ['Cooking', 'Recipes'],
    content: '1. Carbonara: Eggs, Guanciale, Pecorino Romano, Black Pepper\n2. Cacio e Pepe: Pecorino Romano, Black Pepper, Pasta Water',
    lastEdited: '27 Oct 2024',
    isArchived: true,
  }
];

function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeTab, setActiveTab] = useState<'all' | 'archived' | string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      tags: [],
      content: '',
      lastEdited: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      isArchived: false,
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const handleArchiveNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isArchived: !n.isArchived } : n));
  };

  const getHeaderTitle = () => {
    if (activeTab === 'all') return 'All Notes';
    if (activeTab === 'archived') return 'Archived Notes';
    return `Notes Tagged: ${activeTab}`;
  };

  return (
    <div className="flex h-screen bg-base-200 text-base-content overflow-hidden">
      <Sidebar 
        tags={allTags} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedNoteId(null);
        }} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={getHeaderTitle()} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          onThemeChange={setTheme}
        />
        
        <div className="flex-1 flex min-h-0">
          <NoteList 
            notes={filteredNotes} 
            selectedNoteId={selectedNoteId} 
            onSelectNote={(note) => setSelectedNoteId(note.id)}
            onCreateNote={handleCreateNote}
          />
          <NoteEditor 
            note={selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onArchive={handleArchiveNote}
            onBack={() => setSelectedNoteId(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

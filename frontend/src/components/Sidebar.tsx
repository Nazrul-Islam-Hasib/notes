import React from 'react';

interface SidebarProps {
  tags: string[];
  activeTab: 'all' | 'archived' | string;
  setActiveTab: (tab: 'all' | 'archived' | string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tags, activeTab, setActiveTab }) => {
  return (
    <div className="w-20 md:w-64 bg-base-100 border-r border-base-200 flex flex-col h-screen p-4 gap-4 transition-all overflow-hidden">
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <span className="text-xl font-bold italic hidden md:block">Notes</span>
      </div>

      <nav className="flex flex-col gap-1">
        <button 
          onClick={() => setActiveTab('all')}
          className={`btn btn-ghost justify-center md:justify-start gap-3 px-0 md:px-4 ${activeTab === 'all' ? 'btn-active bg-base-200' : ''}`}
          title="All Notes"
        >
          <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="hidden md:block">All Notes</span>
        </button>
        <button 
          onClick={() => setActiveTab('archived')}
          className={`btn btn-ghost justify-center md:justify-start gap-3 px-0 md:px-4 ${activeTab === 'archived' ? 'btn-active bg-base-200' : ''}`}
          title="Archived Notes"
        >
          <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
          <span className="hidden md:block">Archived Notes</span>
        </button>
      </nav>

      <div className="divider text-xs md:text-base">Tags</div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {tags.map(tag => (
          <button 
            key={tag}
            onClick={() => setActiveTab(tag)}
            className={`btn btn-ghost justify-center md:justify-start gap-3 px-0 md:px-4 font-normal ${activeTab === tag ? 'btn-active bg-base-200' : ''}`}
            title={tag}
          >
            <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <span className="hidden md:block truncate">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

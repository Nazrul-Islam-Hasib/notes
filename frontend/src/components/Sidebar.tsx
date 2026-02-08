import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHome, faBoxArchive, faTag } from '@fortawesome/free-solid-svg-icons';

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
           <FontAwesomeIcon icon={faStar} />
        </div>
        <span className="text-xl font-bold italic hidden md:block">Notes</span>
      </div>

      <nav className="flex flex-col gap-1">
        <button 
          onClick={() => setActiveTab('all')}
          className={`btn btn-ghost justify-center md:justify-start gap-3 px-0 md:px-4 ${activeTab === 'all' ? 'btn-active bg-base-200' : ''}`}
          title="All Notes"
        >
          <FontAwesomeIcon icon={faHome} className="shrink-0" />
          <span className="hidden md:block">All Notes</span>
        </button>
        <button 
          onClick={() => setActiveTab('archived')}
          className={`btn btn-ghost justify-center md:justify-start gap-3 px-0 md:px-4 ${activeTab === 'archived' ? 'btn-active bg-base-200' : ''}`}
          title="Archived Notes"
        >
          <FontAwesomeIcon icon={faBoxArchive} className="shrink-0" />
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
            <FontAwesomeIcon icon={faTag} className="shrink-0" />
            <span className="hidden md:block truncate">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHome, faBoxArchive, faTag, faSearch, faGear, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  tags: string[];
  activeTab: 'all' | 'archived' | string;
  setActiveTab: (tab: 'all' | 'archived' | string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onThemeChange: (theme: string) => void;
  onLogout?: () => void;
  userEmail?: string;
  onMobileSearchChange?: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tags, activeTab, setActiveTab, searchQuery, setSearchQuery, onThemeChange, onLogout, userEmail, onMobileSearchChange }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const themes = ["light", "dark"];

  const toggleMobileSearch = () => {
    const newValue = !showMobileSearch;
    setShowMobileSearch(newValue);
    onMobileSearchChange?.(newValue);
  };

  return (
    <>
      {/* Mobile Header with App Icon and Title */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-base-100 border-b border-base-200 h-14 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content shrink-0">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <span className="text-xl font-bold italic">Notes</span>
        </div>
      </div>

      {/* Mobile Search Bar (appears when search is clicked) */}
      {showMobileSearch && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-base-100 border-b border-base-200 p-3 z-40">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Search by title, content, or tags..." 
              className="input input-bordered input-sm pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Desktop/Tablet Sidebar - hidden on mobile */}
      <div className="hidden md:flex w-20 lg:w-64 bg-base-100 border-r border-base-200 flex-col h-screen p-4 gap-4 transition-all overflow-visible">
        <div className="flex items-center gap-2 px-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content shrink-0">
             <FontAwesomeIcon icon={faStar} />
          </div>
          <span className="text-xl font-bold italic hidden lg:block">Notes</span>
        </div>

        <nav className="flex flex-col gap-1">
          <div className="tooltip tooltip-right lg:hidden" data-tip="All Notes">
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-ghost justify-center lg:justify-start gap-3 px-0 lg:px-4 w-full ${activeTab === 'all' ? 'btn-active bg-base-200' : ''}`}
            >
              <FontAwesomeIcon icon={faHome} className="shrink-0" />
              <span className="hidden lg:block">All Notes</span>
            </button>
          </div>
          <button
            onClick={() => setActiveTab('all')}
            className={`hidden lg:flex btn btn-ghost justify-start gap-3 px-4 w-full ${activeTab === 'all' ? 'btn-active bg-base-200' : ''}`}
          >
            <FontAwesomeIcon icon={faHome} className="shrink-0" />
            <span>All Notes</span>
          </button>
          
          <div className="tooltip tooltip-right lg:hidden" data-tip="Archived Notes">
            <button 
              onClick={() => setActiveTab('archived')}
              className={`btn btn-ghost justify-center lg:justify-start gap-3 px-0 lg:px-4 w-full ${activeTab === 'archived' ? 'btn-active bg-base-200' : ''}`}
            >
              <FontAwesomeIcon icon={faBoxArchive} className="shrink-0" />
              <span className="hidden lg:block">Archived Notes</span>
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('archived')}
            className={`hidden lg:flex btn btn-ghost justify-start gap-3 px-4 w-full ${activeTab === 'archived' ? 'btn-active bg-base-200' : ''}`}
          >
            <FontAwesomeIcon icon={faBoxArchive} className="shrink-0" />
            <span>Archived Notes</span>
          </button>
        </nav>

        <div className="divider text-xs lg:text-base hidden lg:flex">Tags</div>
        <div className="divider lg:hidden"></div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          {tags.map(tag => (
            <React.Fragment key={tag}>
              <div className="tooltip tooltip-right lg:hidden" data-tip={tag}>
                <button 
                  onClick={() => setActiveTab(tag)}
                  className={`btn btn-ghost justify-center gap-3 px-0 font-normal w-full ${activeTab === tag ? 'btn-active bg-base-200' : ''}`}
                >
                  <FontAwesomeIcon icon={faTag} className="shrink-0" />
                </button>
              </div>
              <button 
                onClick={() => setActiveTab(tag)}
                className={`hidden lg:flex btn btn-ghost justify-start gap-3 px-4 font-normal w-full ${activeTab === tag ? 'btn-active bg-base-200' : ''}`}
              >
                <FontAwesomeIcon icon={faTag} className="shrink-0" />
                <span className="truncate">{tag}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 flex justify-around items-center h-16 z-50">
        <div className="tooltip tooltip-top md:hidden" data-tip="All Notes">
          <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-ghost btn-sm flex-col gap-0 h-auto py-2 ${activeTab === 'all' ? 'text-primary' : ''}`}
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
        </div>
        <div className="tooltip tooltip-top md:hidden" data-tip="Archived Notes">
          <button
              onClick={() => setActiveTab('archived')}
              className={`btn btn-ghost btn-sm flex-col gap-0 h-auto py-2 ${activeTab === 'archived' ? 'text-primary' : ''}`}
          >
            <FontAwesomeIcon icon={faBoxArchive} />
          </button>
        </div>

        <div className="tooltip tooltip-top md:hidden" data-tip="Search">
          <button
              onClick={toggleMobileSearch}
              className={`btn btn-ghost btn-sm flex-col gap-0 h-auto py-2 ${showMobileSearch ? 'text-primary' : ''}`}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="tooltip tooltip-top md:hidden" data-tip="Settings">
          <div className="dropdown dropdown-top dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm flex-col gap-0 h-auto py-2">
              <FontAwesomeIcon icon={faGear} />
            </div>
            <ul tabIndex={0} className="dropdown-content z-60 menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto mb-2">
              <li className="menu-title text-xs">{userEmail}</li>
              <div className="divider my-0"></div>
              <li className="menu-title text-xs">Theme</li>
              {themes.map(theme => (
                  <li key={theme}><button onClick={() => onThemeChange(theme)} className="capitalize">{theme}</button></li>
              ))}
              <div className="divider my-0"></div>
              {onLogout && (
                  <li>
                    <button onClick={onLogout} className="text-error">
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

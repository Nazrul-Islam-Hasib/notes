import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGear, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onThemeChange: (theme: string) => void;
  onLogout?: () => void;
  userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ title, searchQuery, setSearchQuery, onThemeChange, onLogout, userEmail }) => {
  const themes = ["light", "dark",];

  return (
    <header className="h-16 border-b border-base-200 flex items-center justify-between px-6 bg-base-100">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input 
            type="text" 
            placeholder="Search by title, content, or tags..." 
            className="input input-bordered input-sm pl-10 w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FontAwesomeIcon icon={faGear} size="lg" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto">
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
    </header>
  );
};

export default Header;

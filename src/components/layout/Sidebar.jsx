import { Home, LayoutGrid, Target, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function MenuItem({ icon: Icon, children, path, active }) {
  const location = useLocation();
  const isActive = active !== undefined ? active : location.pathname === path;

  // Split children into title and description
  const childrenArray = Array.isArray(children) ? children : [children];
  const title = childrenArray.find(child => typeof child === 'string');
  const description = childrenArray.find(child => child?.type === 'span');

  return (
    <Link
      to={path}
      className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {isActive && (
          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
        )}
        {!isActive && <div className="w-2" />}
        <Icon size={20} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {description}
        </div>
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Enterprise Platform</h1>
        <p className="text-sm text-gray-400 mt-1">
          Capability & Transformation Management
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2 p-3">
        <MenuItem icon={Home} path="/">
          Dashboard
          <span className="text-xs text-gray-400 block mt-0.5">
            Overview of transformation initiatives
          </span>
        </MenuItem>

        <MenuItem icon={LayoutGrid} path="/solutions-projects">
          Solutions & Projects
          <span className="text-xs text-gray-400 block mt-0.5">
            Manage organizational capabilities & solutions
          </span>
        </MenuItem>

        <MenuItem icon={Target} path="/transformation-planning">
          Transformation Planning
          <span className="text-xs text-gray-400 block mt-0.5">
            Strategic planning and roadmaps
          </span>
        </MenuItem>

        <MenuItem icon={Settings} path="/settings">
          Settings
          <span className="text-xs text-gray-400 block mt-0.5">
            Master data management
          </span>
        </MenuItem>
      </nav>
    </div>
  );
}

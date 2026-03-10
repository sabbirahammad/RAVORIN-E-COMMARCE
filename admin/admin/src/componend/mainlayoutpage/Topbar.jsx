import { Menu, LogOut, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-3 shadow-sm backdrop-blur-xl sm:px-4">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
      >
        <Menu size={24} />
      </button>

      <button
        onClick={onMenuClick}
        className="hidden rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:flex"
      >
        <Menu size={20} />
      </button>

      <div className="ml-2 min-w-0 md:ml-0">
        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">Admin Dashboard</h1>
        <p className="hidden text-xs text-slate-500 sm:block">Simple, responsive control center</p>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <Bell size={20} />
        </button>

        <div className="hidden items-center space-x-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500">
            <User size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-medium text-slate-900">{user?.name || 'Admin'}</span>
            <span className="block text-xs text-slate-500">{user?.email || 'admin@ravorin.com'}</span>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

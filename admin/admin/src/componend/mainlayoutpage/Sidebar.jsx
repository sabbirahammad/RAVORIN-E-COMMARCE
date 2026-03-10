import { NavLink, useNavigate } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  LogOut,
  Tag,
  MessageSquare,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminMenu = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Orders', path: '/orders', icon: ClipboardList },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart2 },
  { name: 'Coupons', path: '/coupons', icon: Tag },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Admin Users', path: '/admin-users', icon: ShieldCheck },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-cyan-50 text-cyan-700 shadow-[0_10px_25px_rgba(6,182,212,0.12)]'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out sm:w-72 md:static md:w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-600">Ravorin</p>
            <h1 className="text-lg font-bold tracking-wide text-slate-900">Admin Panel</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
          <h2 className="mb-3 pl-2 text-xs uppercase tracking-[0.26em] text-slate-500">Navigation</h2>

          {adminMenu.map((item) => (
            <NavLink key={item.name} to={item.path} onClick={onClose} className={navItemClass}>
              <item.icon size={20} className="shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-200 px-3 pb-4 pt-4 sm:px-4">
          <NavLink to="/settings" onClick={onClose} className={navItemClass}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/delivery-costs" onClick={onClose} className={navItemClass}>
            <Package size={20} />
            <span>Delivery Costs</span>
          </NavLink>

          <button
            onClick={() => {
              logout();
              navigate('/login');
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
          Copyright {new Date().getFullYear()} Ravorin
        </div>
      </aside>
    </>
  );
};

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Settings, UserCircle } from 'lucide-react';

import {
  LayoutDashboard, ArrowLeftRight, PiggyBank,
  Wallet, ShieldCheck, TrendingUp
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard,  label: 'Tableau de bord' },
  { to: '/transactions', icon: ArrowLeftRight,   label: 'Transactions' },
  { to: '/budgets',      icon: PiggyBank,        label: 'Budgets' },
  { to: '/comptes',      icon: Wallet,           label: 'Comptes' },
  { to: '/profile',      icon: UserCircle,       label: 'Mon Profil' },      
  { to: '/parametres',   icon: Settings,         label: 'Paramètres' }, 
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-10">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-none">Mizaniiti</h1>
            <p className="text-xs text-slate-400 mt-0.5">Finance Personnelle</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
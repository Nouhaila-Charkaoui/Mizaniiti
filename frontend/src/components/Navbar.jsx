import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  TrendingUp, LayoutDashboard, ArrowLeftRight,
  PiggyBank, Wallet, ShieldCheck, LogOut,
  UserCircle, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

import logo from '../assets/logonouhaila.jpeg';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/budgets',      icon: PiggyBank,       label: 'Budgets' },
  { to: '/comptes',      icon: Wallet,          label: 'Comptes' },
  { to: '/parametres',   icon: Settings,        label: 'Paramètres' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('À bientôt !');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm w-full">
      <div className="w-full px-8 flex items-center justify-between h-18">

        {/* Logo — gauche */}
        <div className="flex items-center gap-3 flex-shrink-0">
  <img src={logo} alt="Mizaniiti" className="w-auto h-12 rounded-xl" />
  <div>
    <span className="font-bold text-primary-600 text-4xl leading-none block" style={{ fontFamily: 'Georgia, serif' }}>Mizaniiti</span>
    
  </div>
</div>

        {/* Liens navigation + actions — droite */}
        <div className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </NavLink>
          )}

          {/* Séparateur */}
          <div className="w-px h-6 bg-slate-200 mx-2" />

          {/* Avatar cliquable → profil */}
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm hover:bg-primary-200 transition-colors"
            title={user?.name}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors ml-1"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
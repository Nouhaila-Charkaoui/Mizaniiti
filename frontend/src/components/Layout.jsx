import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { TrendingUp } from 'lucide-react';

import logo from '../assets/mizaniiti_logo_svg.svg';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6">
      <div className="w-full px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Logo + nom */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Mizaniiti" className="w-30 h-30 rounded-lg" />
          <span style={{ fontFamily: 'Georgia, serif' }} className="text-white font-bold text-lg">Mizaniiti</span>
        </div>

        {/* A propos */}
        <p className="text-sm text-center max-w-md">
          Mizaniiti est une application de gestion financière personnelle. 
          Suivez vos dépenses, gérez vos budgets et atteignez vos objectifs.
        </p>

        {/* Contact + copyright */}
        <div className="text-right text-xs space-y-1">
          <p>support@mizaniiti.com</p>
          <p>Casablanca, Maroc</p>
          <p>© {new Date().getFullYear()} Mizaniiti. Tous droits réservés.</p>
        </div>

      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
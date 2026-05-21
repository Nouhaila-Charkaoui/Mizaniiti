import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { TrendingUp } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6">
      <div className="w-full px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Mizaniiti */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">Mizaniiti</span>
        </div>

        {/* Contact */}
        <p className="text-sm">support@mizaniiti.com — Casablanca, Maroc</p>

        {/* Copyright */}
        <p className="text-xs">© {new Date().getFullYear()} Mizaniiti. Tous droits réservés.</p>
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
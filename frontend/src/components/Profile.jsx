import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, ShieldCheck, Calendar } from 'lucide-react';
import api from '../api/api.js';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth(); // ⚠️ voir modification AuthContext plus bas
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      const response = await api.put('/profile', payload);
      // mettre à jour le user dans le contexte et localStorage
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('mizaniiti_user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mon Profil</h2>
        <p className="text-slate-500 text-sm mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar + infos */}
      <div className="card flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">{user?.name}</p>
          <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
            <Mail className="w-4 h-4" />
            {user?.email}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Formulaire modification */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Modifier mes informations</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nom complet</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Adresse email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <hr className="border-slate-100" />
          <p className="text-sm text-slate-400">Laisser vide pour ne pas changer le mot de passe</p>
          <div>
            <label className="label">Nouveau mot de passe</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">Confirmer le mot de passe</label>
            <input
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Users, ArrowLeftRight, TrendingUp, TrendingDown, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(sRes.data);
      setUsers(uRes.data.data || uRes.data);
    } catch {
      toast.error('Erreur de chargement admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}/toggle`);
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur définitivement ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Utilisateur supprimé.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    }
  };

  const handleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Changer le rôle vers "${newRole}" ?`)) return;
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      toast.success('Rôle mis à jour.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panel Administrateur</h1>
        <p className="text-slate-500">Vue d'ensemble de la plateforme Mizaniiti</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Utilisateurs"   value={stats?.total_users}             icon={Users}          color="bg-primary-100 text-primary-600" />
        <StatCard label="Transactions"   value={stats?.total_transactions}      icon={ArrowLeftRight} color="bg-blue-100 text-blue-600" />
        <StatCard label="Revenus totaux" value={`${stats?.total_revenus?.toLocaleString('fr-MA')} MAD`} icon={TrendingUp}   color="bg-green-100 text-green-600" />
        <StatCard label="Dépenses totales" value={`${stats?.total_depenses?.toLocaleString('fr-MA')} MAD`} icon={TrendingDown} color="bg-red-100 text-red-500" />
      </div>

      {/* Table utilisateurs */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Gestion des utilisateurs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Transactions', 'Inscrit le', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {u.is_active ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.transactions_count}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('fr-MA')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(u.id)}
                        title={u.is_active ? 'Désactiver' : 'Activer'}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          u.is_active
                            ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                            : 'bg-green-50 text-green-500 hover:bg-green-100'
                        }`}
                      >
                        {u.is_active ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleRole(u.id, u.role)}
                        title="Changer le rôle"
                        className="w-7 h-7 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 flex items-center justify-center transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
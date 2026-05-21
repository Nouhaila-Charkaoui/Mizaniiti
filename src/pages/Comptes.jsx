import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Wallet, CreditCard, PiggyBank, Banknote, X } from 'lucide-react';

const typeConfig = {
  courant: { icon: CreditCard, color: 'bg-blue-100 text-blue-600',  label: 'Compte courant' },
  epargne: { icon: PiggyBank,  color: 'bg-green-100 text-green-600', label: 'Épargne' },
  especes: { icon: Banknote,   color: 'bg-amber-100 text-amber-600', label: 'Espèces' },
};

export default function Comptes() {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', type: 'courant', solde_initial: '', devise: 'MAD' });

  const fetchComptes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/comptes');
      setComptes(res.data);
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComptes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/comptes', form);
      toast.success('Compte créé avec succès !');
      setShowModal(false);
      setForm({ nom: '', type: 'courant', solde_initial: '', devise: 'MAD' });
      fetchComptes();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m));
      else toast.error('Erreur lors de la création.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce compte ? Toutes les transactions associées seront supprimées.')) return;
    try {
      await api.delete(`/comptes/${id}`);
      toast.success('Compte supprimé.');
      fetchComptes();
    } catch {
      toast.error('Erreur de suppression.');
    }
  };

  const totalSolde = comptes.reduce((sum, c) => sum + c.solde_actuel, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comptes</h1>
          <p className="text-slate-500">Gérez vos comptes bancaires et portefeuilles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau compte
        </button>
      </div>

      {/* Total solde */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
        <p className="text-primary-200 text-sm">Solde total consolidé</p>
        <p className="text-4xl font-bold mt-1">{totalSolde.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</p>
        <p className="text-primary-200 text-sm mt-1">{comptes.length} compte(s)</p>
      </div>

      {/* Comptes */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comptes.map((compte) => {
            const cfg  = typeConfig[compte.type] || typeConfig.courant;
            const Icon = cfg.icon;
            return (
              <div key={compte.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDelete(compte.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-semibold text-slate-900 text-lg">{compte.nom}</p>
                <p className="text-xs text-slate-400 mb-3">{cfg.label}</p>
                <p className={`text-2xl font-bold ${compte.solde_actuel < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {compte.solde_actuel?.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} {compte.devise}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Solde initial: {compte.solde_initial?.toLocaleString('fr-MA')} {compte.devise}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold">Nouveau compte</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Nom du compte</label>
                  <input type="text" className="input" placeholder="Ex: CIH Compte principal" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="courant">Compte courant</option>
                    <option value="epargne">Épargne</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
                <div>
                  <label className="label">Solde initial (MAD)</label>
                  <input type="number" step="0.01" min="0" className="input" value={form.solde_initial} onChange={e => setForm({ ...form, solde_initial: e.target.value })} required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
                  <button type="submit" className="btn-primary flex-1">Créer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
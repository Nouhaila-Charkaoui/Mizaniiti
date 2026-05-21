import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Filter, X } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [comptes, setComptes]           = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [filters, setFilters]           = useState({ type: '', compte_id: '' });

  const [form, setForm] = useState({
    compte_id: '', categorie_id: '', montant: '',
    type: 'depense', description: '', date_transaction: new Date().toISOString().split('T')[0],
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      ).toString();

      const [tRes, cRes, catRes] = await Promise.all([
        api.get(`/transactions?${params}`),
        api.get('/comptes'),
        api.get('/categories'),
      ]);

      setTransactions(tRes.data.data || tRes.data);
      setComptes(cRes.data);
      setCategories(catRes.data);
    } catch {
      toast.error('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', form);
      toast.success('Transaction ajoutée !');
      setShowModal(false);
      setForm({ compte_id: '', categorie_id: '', montant: '', type: 'depense', description: '', date_transaction: new Date().toISOString().split('T')[0] });
      fetchAll();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m));
      else toast.error('Erreur lors de l\'ajout.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette transaction ?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction supprimée.');
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const catsFiltrees = categories.filter(c => c.type === form.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500">Historique de vos mouvements financiers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="card flex gap-4 flex-wrap items-center">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          className="input max-w-[180px]"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Tous les types</option>
          <option value="revenu">Revenus</option>
          <option value="depense">Dépenses</option>
        </select>
        <select
          className="input max-w-[200px]"
          value={filters.compte_id}
          onChange={(e) => setFilters({ ...filters, compte_id: e.target.value })}
        >
          <option value="">Tous les comptes</option>
          {comptes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        {(filters.type || filters.compte_id) && (
          <button
            onClick={() => setFilters({ type: '', compte_id: '' })}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Date', 'Catégorie', 'Description', 'Compte', 'Montant', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">Chargement...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">Aucune transaction trouvée</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{t.date_transaction}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-slate-700">
                        <span>{t.categorie?.icone}</span>
                        {t.categorie?.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.description || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.compte?.nom}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${t.type === 'revenu' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.type === 'revenu' ? '+' : '-'}{t.montant?.toLocaleString('fr-MA')} MAD
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ajout */}
      {showModal && (
        <Modal title="Nouvelle transaction" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Type</label>
              <div className="flex gap-2">
                {['depense', 'revenu'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t, categorie_id: '' })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      form.type === t
                        ? t === 'revenu' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-slate-100 text-slate-600 border-2 border-transparent'
                    }`}
                  >
                    {t === 'revenu' ? '⬆️ Revenu' : '⬇️ Dépense'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Compte</label>
              <select className="input" value={form.compte_id} onChange={e => setForm({ ...form, compte_id: e.target.value })} required>
                <option value="">Sélectionner un compte</option>
                {comptes.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.solde_actuel?.toLocaleString('fr-MA')} MAD)</option>)}
              </select>
            </div>

            <div>
              <label className="label">Catégorie</label>
              <select className="input" value={form.categorie_id} onChange={e => setForm({ ...form, categorie_id: e.target.value })} required>
                <option value="">Sélectionner une catégorie</option>
                {catsFiltrees.map(c => <option key={c.id} value={c.id}>{c.icone} {c.nom}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Montant (MAD)</label>
              <input type="number" step="0.01" min="0.01" className="input" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} required />
            </div>

            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date_transaction} onChange={e => setForm({ ...form, date_transaction: e.target.value })} required />
            </div>

            <div>
              <label className="label">Description (optionnel)</label>
              <input type="text" className="input" placeholder="Ex: Supermarché Carrefour" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button type="submit" className="btn-primary flex-1">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
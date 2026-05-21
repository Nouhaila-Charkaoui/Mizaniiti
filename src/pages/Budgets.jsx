import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

function BudgetCard({ budget, onDelete, onEdit }) {
  const { pourcentage, statut, categorie, montant_initial, montant_depense, solde_restant } = budget;

  const barColor = statut === 'danger'
    ? 'bg-red-500'
    : statut === 'warning'
    ? 'bg-orange-400'
    : 'bg-green-500';

  const cardBorder = statut === 'danger'
    ? 'border-red-200 bg-red-50/30'
    : statut === 'warning'
    ? 'border-orange-200 bg-orange-50/30'
    : 'border-slate-100';

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm ${cardBorder}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
            {categorie?.icone}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{categorie?.nom}</p>
            <p className="text-xs text-slate-400">Budget mensuel</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(budget)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(budget.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Consommé</span>
          <span className={`font-bold ${statut === 'danger' ? 'text-red-600' : statut === 'warning' ? 'text-orange-600' : 'text-green-600'}`}>
            {pourcentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(pourcentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{montant_depense?.toLocaleString('fr-MA')} MAD dépensé</span>
          <span>{montant_initial?.toLocaleString('fr-MA')} MAD budget</span>
        </div>
        {statut === 'danger' && (
          <p className="text-xs text-red-600 font-medium">🚨 Budget presque épuisé !</p>
        )}
        {statut === 'warning' && (
          <p className="text-xs text-orange-600 font-medium">⚠️ Attention au budget</p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Restant</span>
          <span className={`font-semibold ${solde_restant < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {solde_restant?.toLocaleString('fr-MA')} MAD
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Budgets() {
  const [budgets, setBudgets]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [mois, setMois]   = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());

  const [form, setForm] = useState({ categorie_id: '', montant_initial: '', mois, annee });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        api.get(`/budgets?mois=${mois}&annee=${annee}`),
        api.get('/categories'),
      ]);
      setBudgets(bRes.data);
      setCategories(cRes.data.filter(c => c.type === 'depense'));
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, [mois, annee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBudget) {
        await api.put(`/budgets/${editBudget.id}`, { montant_initial: form.montant_initial });
        toast.success('Budget modifié !');
      } else {
        await api.post('/budgets', { ...form, mois, annee });
        toast.success('Budget créé !');
      }
      setShowModal(false);
      setEditBudget(null);
      setForm({ categorie_id: '', montant_initial: '', mois, annee });
      fetchBudgets();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur.';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce budget ?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Budget supprimé.');
      fetchBudgets();
    } catch {
      toast.error('Erreur de suppression.');
    }
  };

  const handleEdit = (budget) => {
    setEditBudget(budget);
    setForm({ ...form, montant_initial: budget.montant_initial });
    setShowModal(true);
  };

  const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budgets</h1>
          <p className="text-slate-500">Définissez et suivez vos limites de dépenses</p>
        </div>
        <button onClick={() => { setEditBudget(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau budget
        </button>
      </div>

      {/* Sélecteur mois/année */}
      <div className="card flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {moisNoms.map((m, i) => (
            <button
              key={i}
              onClick={() => setMois(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mois === i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <select
          className="input max-w-[100px]"
          value={annee}
          onChange={e => setAnnee(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Budgets grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🐷</p>
          <p className="text-slate-900 font-medium">Aucun budget pour ce mois</p>
          <p className="text-slate-400 text-sm">Créez votre premier budget pour contrôler vos dépenses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold">{editBudget ? 'Modifier le budget' : 'Nouveau budget'}</h2>
              <button onClick={() => { setShowModal(false); setEditBudget(null); }} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editBudget && (
                  <div>
                    <label className="label">Catégorie de dépense</label>
                    <select className="input" value={form.categorie_id} onChange={e => setForm({ ...form, categorie_id: e.target.value })} required>
                      <option value="">Sélectionner</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icone} {c.nom}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="label">Montant du budget (MAD)</label>
                  <input type="number" step="0.01" min="1" className="input" value={form.montant_initial} onChange={e => setForm({ ...form, montant_initial: e.target.value })} required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setEditBudget(null); }} className="btn-secondary flex-1">Annuler</button>
                  <button type="submit" className="btn-primary flex-1">{editBudget ? 'Modifier' : 'Créer'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
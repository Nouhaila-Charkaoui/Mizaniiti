import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, subtitle }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function BudgetAlert({ budgets }) {
  const alerts = budgets.filter(b => b.pourcentage >= 70);
  if (!alerts.length) return null;

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 mb-4">⚠️ Alertes Budgets</h3>
      <div className="space-y-3">
        {alerts.map((b) => {
          const color = b.pourcentage >= 90
            ? 'bg-red-500'
            : b.pourcentage >= 70
            ? 'bg-orange-400'
            : 'bg-green-500';

          const bg = b.pourcentage >= 90
            ? 'bg-red-50 border-red-100'
            : 'bg-orange-50 border-orange-100';

          return (
            <div key={b.id} className={`p-3 rounded-xl border ${bg}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-slate-700">
                  {b.categorie?.icone} {b.categorie?.nom}
                </span>
                <span className="text-sm font-bold text-slate-900">{b.pourcentage}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${color}`}
                  style={{ width: `${Math.min(b.pourcentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {b.montant_depense?.toLocaleString('fr-MA')} / {b.montant_initial?.toLocaleString('fr-MA')} MAD
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COLORS = ['#6366f1', '#f97316', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function Dashboard() {
  const { user }  = useAuth();
  const [stats, setStats]     = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const mois  = new Date().getMonth() + 1;
  const annee = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      api.get(`/stats?mois=${mois}&annee=${annee}`),
      api.get(`/budgets?mois=${mois}&annee=${annee}`),
    ]).then(([statsRes, budgetsRes]) => {
      setStats(statsRes.data);
      setBudgets(budgetsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  const fmt = (n) => n?.toLocaleString('fr-MA', { minimumFractionDigits: 2 }) + ' MAD';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Bonjour {user?.name} 👋, voici votre résumé financier</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Revenus ce mois"
          value={fmt(stats?.total_revenus)}
          icon={TrendingUp}
          color="bg-green-100 text-green-600"
          subtitle="Ce mois-ci"
        />
        <StatCard
          label="Dépenses ce mois"
          value={fmt(stats?.total_depenses)}
          icon={TrendingDown}
          color="bg-red-100 text-red-500"
          subtitle="Ce mois-ci"
        />
        <StatCard
          label="Solde net"
          value={fmt(stats?.solde_net)}
          icon={Wallet}
          color={stats?.solde_net >= 0 ? 'bg-primary-100 text-primary-600' : 'bg-orange-100 text-orange-600'}
          subtitle="Revenus - Dépenses"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Évolution chart */}
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-4">Évolution sur 6 mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats?.evolution}>
              <defs>
                <linearGradient id="revenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="depenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value.toLocaleString('fr-MA')} MAD`]}
              />
              <Legend />
              <Area type="monotone" dataKey="revenus"  name="Revenus"  stroke="#22c55e" fill="url(#revenus)"  strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#ef4444" fill="url(#depenses)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes budgets */}
        <BudgetAlert budgets={budgets} />

        {/* Dernières transactions */}
        <div className="card w-full col-span-full">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold text-slate-900">Dernières transactions</h3>
            <a href="/transactions" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
              Voir tout <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {stats?.dernieres_transactions?.length > 0 ? (
              stats.dernieres_transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-base">
                      {t.categorie?.icone}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {t.description || t.categorie?.nom}
                      </p>
                      <p className="text-xs text-slate-400">{t.date_transaction}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === 'revenu' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'revenu' ? '+' : '-'}{t.montant?.toLocaleString('fr-MA')} MAD
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">Aucune transaction</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
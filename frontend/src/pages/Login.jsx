import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp, Eye, EyeOff, BarChart2, PiggyBank, Shield } from 'lucide-react';
import bgLogin from '../assets/money.jpg';


// ── Footer réutilisable ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-8">
        {/* Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          {/* Marque */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Mizaniiti</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Gérez vos finances personnelles avec élégance. Suivez vos dépenses, planifiez vos budgets et atteignez vos objectifs.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Navigation</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login"    className="hover:text-white transition-colors">Connexion</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Inscription</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Tableau de bord</Link></li>
              <li><Link to="/budgets"   className="hover:text-white transition-colors">Budgets</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>support@mizaniiti.com</li>
              <li>Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Mizaniiti. Tous droits réservés.</p>
          <p>Fait avec ❤️ par l'équipe Mizaniiti</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page Login ───────────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ✅ Même logique qu'avant — rien ne change
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue, ${user.name} !`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Identifiants incorrects.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Corps principal : deux colonnes ── */}
      <div className="flex flex-1">

        {/* Panneau gauche — présentation */}
        <div
  className="hidden lg:flex w-3/5 flex-col items-center justify-center p-16 text-white relative overflow-hidden"
  style={{
    backgroundImage: `url(${bgLogin})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Overlay vert semi-transparent par dessus l'image */}
  <div className="absolute inset-0 bg-primary-600/70" style={{ backdropFilter: 'blur(2px)' }} />

  {/* Cercles décoratifs */}
  <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/5" />
  <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/5" />

  {/* Tout le contenu existant reste pareil, juste ajouter z-10 */}
  <div className="flex items-center gap-4 mb-14 z-10">
    ...
  </div>
  ...
          {/* Logo */}
<div className="flex items-center gap-4 mb-14 z-10">
  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
    <TrendingUp className="w-8 h-8 text-white" />
  </div>
  <div>
    <h1 className="text-4xl font-bold leading-tight">Mizaniyati</h1>
    <p className="text-white/70 text-sm font-medium">ميزانيتي</p>
  </div>
</div>

          {/* Accroche */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Vos finances,<br />en un seul endroit
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed max-w-sm">
              Suivez vos dépenses, construisez vos budgets et atteignez vos objectifs financiers.
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-4 w-full max-w-sm">
            {[
              { icon: BarChart2, title: 'Tableaux de bord',    desc: 'Visualisez vos finances en un coup d\'œil' },
              { icon: PiggyBank, title: 'Gestion des budgets', desc: 'Planifiez et respectez vos limites de dépenses' },
              { icon: Shield,    title: 'Données sécurisées',  desc: 'Vos informations sont chiffrées et protégées' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-primary-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droit — formulaire */}
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md">

            {/* Logo mobile uniquement */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-3">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Mizaniiti</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Connexion</h2>

              {/* ✅ Formulaire identique à l'original */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Adresse email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="vous@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary-600 font-medium hover:underline">
                  S'inscrire
                </Link>
              </p>

              {/* Comptes de démo — identique */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Comptes de démo</p>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>👑 Admin: <code className="bg-white px-1 rounded">admin@mizaniiti.com</code> / <code className="bg-white px-1 rounded">password</code></p>
                  <p>👤 User: <code className="bg-white px-1 rounded">user@mizaniiti.com</code> / <code className="bg-white px-1 rounded">password</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { TrendingUp, PieChart, Bell, Lock } from 'lucide-react';
import bgLogin from '../assets/money.jpg';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error("Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche 3/5 ── */}
      <div
  className="hidden lg:flex w-3/5 flex-col items-center justify-center p-16 text-white relative overflow-hidden"
  style={{
    backgroundImage: `url(${bgLogin})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Overlay vert flou par dessus l'image */}
  <div className="absolute inset-0 bg-primary-600/70" style={{ backdropFilter: 'blur(2px)' }} />

        {/* Cercles décoratifs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-[-40px] w-48 h-48 rounded-full bg-white/5" />

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
        <div className="text-center mb-16 z-10">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Commencez<br />gratuitement
          </h2>
          <p className="text-orange-100 text-xl leading-relaxed max-w-md">
            Rejoignez des milliers d'utilisateurs qui maîtrisent leur budget avec Mizaniiti.
          </p>
        </div>

        {/* Fonctionnalités */}
        <div className="space-y-4 w-full max-w-md z-10">
          {[
            { icon: PieChart, title: 'Suivi des dépenses', desc: 'Catégorisez et analysez vos dépenses facilement' },
            { icon: Bell,     title: 'Alertes budgets',    desc: 'Soyez alerté avant de dépasser vos limites' },
            { icon: Lock,     title: 'Données privées',    desc: 'Vos informations ne sont jamais partagées' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-base">{title}</p>
                <p className="text-orange-100 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit 2/5 ── */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-sm">

          {/* Logo mobile uniquement */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-3">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Mizaniiti</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Inscription</h2>
          <p className="text-slate-500 text-sm mb-8">Créez votre compte gratuitement.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'name',                  label: 'Nom complet',               type: 'text',     placeholder: 'Youssef Alami' },
              { name: 'email',                 label: 'Adresse email',             type: 'email',    placeholder: 'vous@example.com' },
              { name: 'password',              label: 'Mot de passe',              type: 'password', placeholder: '8 caractères minimum' },
              { name: 'password_confirmation', label: 'Confirmer le mot de passe', type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input
                  type={type}
                  name={name}
                  className="input"
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
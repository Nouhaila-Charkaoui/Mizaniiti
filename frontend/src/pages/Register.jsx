import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import brandImage from "../assets/flosimg.jpeg";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      toast.success("Compte créé avec succès");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA] overflow-hidden">
      <div className="hidden lg:flex">
        <img
          src={brandImage}
          alt="Mizaniiti"
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="flex items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-[380px] bg-white rounded-[8px] shadow-[0_12px_35px_rgba(0,0,0,0.10)] border border-slate-100 px-8 py-9">
          <h2 className="text-[34px] font-bold text-[#111827] text-center mb-2">
            Inscription
          </h2>

          <p className="text-center text-[#4B5563] text-[15px] mb-8">
            Créez votre compte gratuitement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2 font-medium">
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Youssef Alami"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[15px] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2 font-medium">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[15px] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2 font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 pr-10 text-[15px] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 bg-transparent p-0"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2 font-medium">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 pr-10 text-[15px] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 bg-transparent p-0"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] rounded-[6px] bg-[#10B981] hover:bg-[#0ea271] text-white text-[15px] font-bold shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition disabled:opacity-60"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-[#4B5563] text-[14px] mt-6">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-bold text-[#10B981] hover:text-[#0ea271]"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
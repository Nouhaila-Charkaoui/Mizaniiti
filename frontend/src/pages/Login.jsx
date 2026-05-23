import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

//import brandImage from "../assets/login-brand.png";
import brandImage from "../assets/logoauth.png" ;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Bienvenue ${user.name}`);
      navigate("/dashboard");
    } catch {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA] overflow-hidden">
      <div className="hidden lg:flex items-center justify-center bg-[#14A06E]/10">
        <img
          src={brandImage}
          alt="Mizaniiti"
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="flex items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-[335px] bg-white rounded-[8px] shadow-[0_12px_35px_rgba(0,0,0,0.10)] border border-slate-100 px-8 py-9">
          <h2 className="text-[32px] font-bold text-[#111827] text-center mb-8">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2">
                Adresse email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[15px] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-[#4B5563] text-[14px] mb-2">
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
              <p className="text-xs text-slate-400 mt-1">Au moins 8 caractères</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] rounded-[6px] bg-[#10B981] hover:bg-[#0ea271] text-white text-[14px] font-bold shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-[#4B5563] text-[14px] mt-6">
            Pas encore de compte?{" "}
            <Link
              to="/register"
              className="font-bold text-[#111827] hover:text-[#10B981]"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
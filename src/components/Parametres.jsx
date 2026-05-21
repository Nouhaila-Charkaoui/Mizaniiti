import { useSettings } from '../context/SettingsContext.jsx';
import { Moon, Sun, Globe } from 'lucide-react';

const langues = [
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

export default function Parametres() {
  const { darkMode, toggleDark, langue, setLangue } = useSettings();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Paramètres</h2>
        <p className="text-slate-500 text-sm mt-1">Personnalisez votre expérience</p>
      </div>

      {/* Dark mode */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Apparence</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode
              ? <Moon className="w-5 h-5 text-primary-500" />
              : <Sun className="w-5 h-5 text-amber-500" />
            }
            <div>
              <p className="text-sm font-medium text-slate-900">
                Mode {darkMode ? 'sombre' : 'clair'}
              </p>
              <p className="text-xs text-slate-400">Changer l'apparence de l'interface</p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={toggleDark}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-primary-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Langue */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-500" />
          Langue
        </h3>
        <div className="space-y-2">
          {langues.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLangue(code)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                langue === code
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-100 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
              {langue === code && (
                <span className="w-2 h-2 rounded-full bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
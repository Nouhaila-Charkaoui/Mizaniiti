import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('mizaniiti_dark') === 'true';
  });

  const [langue, setLangue] = useState(() => {
    return localStorage.getItem('mizaniiti_langue') || 'fr';
  });

  // Applique immédiatement au montage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // <- au montage uniquement

  // Applique à chaque changement
  useEffect(() => {
    localStorage.setItem('mizaniiti_dark', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mizaniiti_langue', langue);
  }, [langue]);

  const toggleDark = () => setDarkMode(prev => !prev);

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDark, langue, setLangue }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets     from './pages/Budgets';
import Comptes     from './pages/Comptes';
import AdminPanel  from './pages/AdminPanel';
import Layout      from './components/Layout';

import Profile    from './components/Profile.jsx';
import Parametres from './components/Parametres.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* Routes publiques */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées avec layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets"      element={<Budgets />} />
            <Route path="comptes"      element={<Comptes />} />
            <Route path="profile"    element={<Profile />} />
<Route path="parametres" element={<Parametres />} />
            <Route path="admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
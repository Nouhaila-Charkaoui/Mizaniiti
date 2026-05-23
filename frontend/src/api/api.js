import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Injecter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mizaniiti_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs 401 globalement
{/*api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mizaniiti_token');
      localStorage.removeItem('mizaniiti_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);*/}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas rediriger si on est déjà sur /login ou /register
    const isAuthRoute = window.location.pathname === '/login' || 
                        window.location.pathname === '/register';
    
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('mizaniiti_token');
      localStorage.removeItem('mizaniiti_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
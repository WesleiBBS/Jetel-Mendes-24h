import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstallPWA from './components/Common/InstallPWA';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Importe seu logo (ajuste o caminho se necessário)
import logo from './assets/logo.png';

// Importe suas páginas (crie os arquivos se ainda não existirem)
import SurveyPage from './pages/SurveyPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

// Rota protegida para o admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mb-4"></div>
          <span className="text-blue-600 font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* Logo no topo */}
        <header className="w-full flex justify-center py-6 bg-white/80 shadow-md">
          <img src={logo} alt="Pronto Atendimento Jetel Mendes" className="h-20 object-contain" />
        </header>
        <div className="flex-1 flex flex-col">
          <Routes>
            {/* Tela do usuário para responder o questionário */}
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center min-h-screen">
                <SurveyPage />
              </div>
            } />
            <Route path="/pesquisa" element={
              <div className="flex flex-col items-center justify-center min-h-screen">
                <SurveyPage />
              </div>
            } />

            {/* Tela de login do administrador */}
            <Route path="/admin/login" element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-white/80 rounded-lg shadow-lg p-8 m-4">
                <LoginPage />
              </div>
            } />

            {/* Tela do painel do administrador (protegida) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col items-center justify-center min-h-screen bg-white/80 rounded-lg shadow-lg p-8 m-4">
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirecionamento e fallback */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <InstallPWA />
      </div>
    </Router>
  );
}

export default App;
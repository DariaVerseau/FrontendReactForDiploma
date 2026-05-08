// src/components/Header.jsx
import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';

export default function Header({ user, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (email, password) => {
    await login({ email, password });
  };

  const handleRegister = async (email, password) => {
    await register({ email, password });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <FiUser className="text-gray-600" />
              <span>User {user.id}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiUser className="text-gray-600" size={16} />
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiUser size={18} />
            Войти
          </button>
        )}
      </div>
      
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </header>
  );
}
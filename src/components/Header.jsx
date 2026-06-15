// src/components/Header.jsx
import { useState } from 'react';
import { FiUser, FiLogOut, FiKey } from 'react-icons/fi';
import AuthModal from './AuthModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (email, password) => {
    await login(email, password);
    setIsModalOpen(false);
  };

  const handleRegister = async (email, password) => {
    await register(email, password);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const handleChangePassword = () => {
    setShowUserMenu(false);
    setIsChangePasswordOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Smart Image Lab</span>
          </Link>

          {/* Правая часть с авторизацией */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiUser className="text-gray-600" />
                  <span className="text-sm text-gray-700">User {user.id}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Выпадающее меню */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={handleChangePassword}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiKey size={14} />
                      Сменить пароль
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiLogOut size={14} />
                      Выйти
                    </button>
                  </div>
                )}
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
        </div>
      </header>

      {/* Модальные окна */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
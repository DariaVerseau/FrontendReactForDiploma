// src/components/AuthModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister 
}) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Очистка полей при переключении режима
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isLoginMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        await onLogin(email, password); // ← вызываем пропс
      } else {
        await onRegister(email, password); // ← вызываем пропс
      }
      onClose();
    } catch (error) {
      alert(error.message || 'Ошибка при авторизации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLoginMode ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
                </h2>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Email поле */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="example@mail.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <input
                type="text"
                name="username"
                autoComplete="username"
                className="hidden"
                value={email}
              />

              {/* Пароль поле */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                  />
                </div>
              </div>

              {/* Дополнительные элементы для регистрации */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <FiCheck className="spinner mr-2" size={18} />
                    Обработка...
                  </>
                ) : (
                  isLoginMode ? 'Войти' : 'Зарегистрироваться'
                )}
              </button>
            </form>

            {/* Нижняя часть */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-center text-gray-600 text-sm">
                {isLoginMode ? (
                  <>
                    Нет учетной записи?{' '}
                    <button 
                      onClick={() => setIsLoginMode(false)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Зарегистрируйтесь
                    </button>
                  </>
                ) : (
                  <>
                    Уже есть аккаунт?{' '}
                    <button 
                      onClick={() => setIsLoginMode(true)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Войдите
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
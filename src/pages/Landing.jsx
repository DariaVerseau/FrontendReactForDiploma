// src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
    
    // Проверяем параметр login в URL
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setIsAuthModalOpen(true);
      // Очищаем URL от параметра
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <header className="py-16 md:py-24 px-4 text-center">
        <h1
          className={`text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Smart Image Lab
        </h1>
        <p
          className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Искусственный интеллект для переноса стиля, улучшения качества и восстановления ваших изображений — быстро, красиво и бесплатно.
        </p>
        
        <button
          onClick={handleGetStarted}
          className={`inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } hover:-translate-y-1`}
        >
          Начать сейчас
        </button>
      </header>

      {/* Mockup */}
      <section className="px-4 mb-20">
        <div
          className={`max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 h-80 md:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-700">Интерфейс загрузки и обработки изображений</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Перенос стиля', desc: 'Применяйте художественные стили великих мастеров к вашим фотографиям.' },
              { icon: '🔍', title: 'Увеличение разрешения', desc: 'Повышайте качество до 4K без потери деталей с помощью нейросетей.' },
              { icon: '✨', title: 'Улучшение качества', desc: 'Восстанавливайте старые и повреждённые фото, улучшайте лица и текстуры.' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${500 + idx * 150}ms` }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={`text-2xl md:text-3xl font-bold mb-6 transition-opacity duration-700 delay-900 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Готовы преобразить свои изображения?
          </h2>
          <button
            onClick={handleGetStarted}
            className={`inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Начать сейчас
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        © {new Date().getFullYear()} Smart Image Lab. Все права защищены.
      </footer>

      {/* Модальное окно входа */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  );
};

export default Landing;
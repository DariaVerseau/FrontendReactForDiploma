// src/components/Gallery.jsx
import { useState, useEffect, useRef } from 'react';
import { imageApi } from '../services/api';
import { FiImage, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';

export default function Gallery({ user, refreshTrigger }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const limit = 6;

  useEffect(() => {
    if (refreshTrigger) {
      setPage(1);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (user) {
      loadGallery();
    }
  }, [user, refreshTrigger, page]);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageApi.getGallery(page, limit);
      
      if (response.data && response.data.items) {
        setImages(response.data.items);
        setTotal(response.data.total);
        setTotalPages(response.data.total_pages);
      } else if (Array.isArray(response.data)) {
        setImages(response.data);
        setTotal(response.data.length);
        setTotalPages(1);
      } else {
        setImages([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Gallery load error:', error);
      setError('Не удалось загрузить галерею');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setShowPageDropdown(false);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setShowPageDropdown(false);
    }
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
    setShowPageDropdown(false);
  };

  // ✅ Генерация списка страниц для выпадающего меню (в колонку)
  const getPageOptions = () => {
    const options = [];
    // Показываем все страницы, но с ограничением по высоте (скролл)
    const maxVisible = 50;
    const startPage = 1;
    const endPage = Math.min(totalPages, maxVisible);
    
    for (let i = startPage; i <= endPage; i++) {
      options.push(i);
    }
    return options;
  };

  // Закрытие выпадающего списка при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPageDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-center">Войдите, чтобы увидеть свои изображения</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <div className="flex-1 flex items-center justify-center flex-col">
          <div className="text-center text-red-500">{error}</div>
          <button 
            onClick={loadGallery}
            className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium mb-4 flex-shrink-0">
        Галерея ({total} изображений)
      </h3>
      
      {images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              У вас пока нет изображений.<br />
              Загрузите первое изображение для обработки!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ Сетка изображений — 2 колонки, 3 ряда = 6 изображений */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={`http://localhost:8080/${image.url}`}
                    alt={image.title || 'Image'}
                    className="w-full aspect-square object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image load error for:', image.url);
                      e.target.style.display = 'none';
                    }}
                  />
                  {image.style && image.style !== 'original' && (
                    <div className="absolute bottom-1 right-1 bg-indigo-600 text-white text-xs px-1 rounded">
                      {image.style}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* ✅ Пагинация с выпадающим списком (в колонку, со скроллом) */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiChevronLeft size={16} />
                  Назад
                </button>
                
                {/* ✅ ВЫПАДАЮЩИЙ СПИСОК (В КОЛОНКУ, СО СКРОЛЛОМ) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowPageDropdown(!showPageDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Страница {page} из {totalPages}
                    <FiChevronDown size={14} className={`transition-transform ${showPageDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showPageDropdown && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                      <div className="max-h-60 overflow-y-auto">
                        {getPageOptions().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                              page === pageNum
                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                : 'text-gray-700'
                            } ${pageNum !== totalPages ? 'border-b border-gray-100' : ''}`}
                          >
                            Страница {pageNum}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Вперёд
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
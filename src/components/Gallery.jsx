// src/components/Gallery.jsx
import { useState, useEffect } from 'react';
import { imageApi } from '../services/api';

export default function Gallery({ user }) {
  const [images, setImages] = useState([]); // ← Убедитесь, что начальное значение [], а не null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadGallery();
    }
  }, [user]);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageApi.getGallery();
      // ✅ Защита: убеждаемся, что response.data - это массив
      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Gallery load error:', error);
      setError('Не удалось загрузить галерею');
      setImages([]); // ← Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  // ✅ Защита при рендеринге
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <p className="text-gray-500 text-center">Войдите, чтобы увидеть свои изображения</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <div className="text-center text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Галерея</h3>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">
        Галерея ({images.length})
      </h3>
      
      {images.length === 0 ? (
        <p className="text-gray-500 text-center">
          У вас пока нет изображений. Загрузите первое изображение для обработки!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.original_url || image.url}
                alt={image.title || 'Image'}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
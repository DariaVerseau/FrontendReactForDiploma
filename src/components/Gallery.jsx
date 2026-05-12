// src/components/Gallery.jsx
import { useState, useEffect } from 'react';
import { imageApi } from '../services/api';
import { FiImage } from 'react-icons/fi';

export default function Gallery({ user, refreshTrigger }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadGallery();
    }
  }, [user, refreshTrigger]);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageApi.getGallery();
      console.log('Gallery response:', response.data);
      
      let imagesArray = [];
      if (Array.isArray(response.data)) {
        imagesArray = response.data;
      } else {
        imagesArray = [];
      }
      
      setImages(imagesArray);
    } catch (error) {
      console.error('Gallery load error:', error);
      setError('Не удалось загрузить галерею');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

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
        <button 
          onClick={loadGallery}
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">
        Галерея ({images.length})
      </h3>
      
      {images.length === 0 ? (
        <div className="text-center py-8">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            У вас пока нет изображений.<br />
            Загрузите первое изображение!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              {/* ✅ ПРАВИЛЬНЫЙ URL */}
              <img
                src={`http://localhost:8080${image.url}`}
                alt={image.title || 'Image'}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image load error for:', image.url);
                  e.target.src = 'https://via.placeholder.com/150?text=Error';
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
      )}
    </div>
  );
}
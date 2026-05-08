import { useEffect, useState } from 'react';
import { imageApi } from '../services/api';
import Card from './ui/Card';

export default function Gallery({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const loadGallery = async () => {
      setLoading(true);
      try {
        const res = await imageApi.getGallery();
        setImages(res.data);
      } catch (error) {
        console.error('Gallery load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [user]);

  if (!user) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Ваша галерея</h2>
        <p className="text-gray-500">Войдите, чтобы увидеть обработанные изображения</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Ваша галерея</h2>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Нет обработанных изображений
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map(img => (
            <div 
              key={img.id} 
              className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img 
                src={`http://localhost:8080${img.url}`} 
                alt={img.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="text-white text-xs font-medium truncate">{img.title}</div>
                <div className="text-white/80 text-xs truncate">{img.style}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
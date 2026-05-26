import { useState, useEffect } from 'react';
import { FiLoader, FiImage } from 'react-icons/fi';
import Card from './ui/Card';

// Локальная SVG-заглушка (не требует интернета)
const getPlaceholderSVG = (text) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;

export default function PreviewPanel({ original, processed, isProcessing }) {
  const [originalUrl, setOriginalUrl] = useState(null);

  // Создаём URL для оригинального файла
  useEffect(() => {
    if (original && original instanceof File) {
      const url = URL.createObjectURL(original);
      setOriginalUrl(url);
      
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else if (typeof original === 'string') {
      setOriginalUrl(original);
    } else {
      setOriginalUrl(null);
    }
  }, [original]);

  useEffect(() => {
    return () => {
      if (originalUrl && originalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalUrl);
      }
    };
  }, [originalUrl]);

  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold mb-4">Превью обработки</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
        {/* Original */}
        <div className="border rounded-lg overflow-hidden relative bg-gray-50">
          {originalUrl ? (
            <img 
              src={originalUrl} 
              alt="Original" 
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Original image load error');
                e.target.src = getPlaceholderSVG('Ошибка загрузки');
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FiImage className="w-12 h-12 mb-2" />
              <span>Исходное изображение</span>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            До
          </div>
        </div>
        
        {/* Processed */}
        <div className="border rounded-lg overflow-hidden relative bg-gray-50">
          {isProcessing ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <FiLoader className="animate-spin text-indigo-600 text-3xl mb-2" />
              <span>Обработка...</span>
            </div>
          ) : processed ? (
            <img 
              src={processed} 
              alt="Processed" 
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Processed image load error:', processed);
                e.target.src = getPlaceholderSVG('Ошибка загрузки');
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FiImage className="w-12 h-12 mb-2" />
              <span>Результат обработки</span>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            После
          </div>
        </div>
      </div>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { FiLoader, FiImage } from 'react-icons/fi';
import Card from './ui/Card';

export default function PreviewPanel({ original, processed, isProcessing }) {
  const [originalUrl, setOriginalUrl] = useState(null);

  // Создаём URL для оригинального файла
  useEffect(() => {
    if (original && original instanceof File) {
      const url = URL.createObjectURL(original);
      setOriginalUrl(url);
      
      // Очищаем URL при размонтировании или изменении файла
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else if (typeof original === 'string') {
      // Если original это строка (URL)
      setOriginalUrl(original);
    } else {
      setOriginalUrl(null);
    }
  }, [original]);

  // Очищаем processed URL если это object URL (не нужно для обычных HTTP URL)
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
                e.target.src = 'https://via.placeholder.com/300?text=Error';
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
                e.target.src = 'https://via.placeholder.com/300?text=Error';
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
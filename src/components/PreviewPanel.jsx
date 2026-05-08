import { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import Card from './ui/Card';

export default function PreviewPanel({ original, processed, isProcessing }) {
  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold mb-4">Превью обработки</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
        {/* Original */}
        <div className="border rounded-lg overflow-hidden relative">
          {original ? (
            <img 
              src={URL.createObjectURL(original)} 
              alt="Original" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Исходное
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            До
          </div>
        </div>
        
        {/* Processed */}
        <div className="border rounded-lg overflow-hidden relative">
          {isProcessing ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <FiLoader className="spinner text-indigo-600 text-2xl mb-2" />
              Обработка...
            </div>
          ) : processed ? (
            <img 
              src={processed} 
              alt="Processed" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Результат
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
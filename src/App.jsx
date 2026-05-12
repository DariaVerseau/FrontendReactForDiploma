// src/App.jsx
import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import { imageApi } from './services/api';
import AuthModal from './components/AuthModal';
import UploadPanel from './components/UploadPanel';
import PreviewPanel from './components/PreviewPanel';
import ControlsPanel from './components/ControlsPanel';
import Gallery from './components/Gallery';

export default function App() {
  const { user, login, register, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [refreshGallery, setRefreshGallery] = useState(0);
  
  // Состояния для параметров операций
  const [operationParams, setOperationParams] = useState({});
  const [upscaleParams, setUpscaleParams] = useState({ scale: 2 });
  const [styleTransferParams, setStyleTransferParams] = useState({ 
    style: 'vangogh', 
    alpha: 1.0, 
    preserve_color: false 
  });
  const [restorePortraitParams, setRestorePortraitParams] = useState({
    fidelity_weight: 0.5,
    postprocess: true
  });
  const [postProcessParams, setPostProcessParams] = useState({
    sharpness: 1.25,
    contrast: 1.12,
    brightness: 1.05,
    denoise: true
  });

  const handleFileSelect = (file) => {
  if (file) {
    setSelectedFile(file);
    setProcessedUrl(null);
    setOriginalPreview(file); 
  } else {
    setSelectedFile(null);
    setOriginalPreview(null);
    setProcessedUrl(null);
  }
};

  const handleOperationParamsChange = (operationId, params) => {
    console.log('Params changed:', operationId, params);
    setOperationParams(params);
    
    // Сохраняем параметры для каждой операции
    if (operationId === 'enhance_quality') {
      setUpscaleParams(params);
    } else if (operationId === 'style_transfer') {
      setStyleTransferParams(params);
    } else if (operationId === 'restore_portrait') {
      setRestorePortraitParams(params);
    } else if (operationId === 'postprocess') {
      setPostProcessParams(params);
    }
  };

  const uploadImage = async (file) => {
    try {
      console.log('📤 Загрузка изображения:', file.name);
      const response = await imageApi.upload(file);
      console.log('✅ Изображение загружено:', response.data);
      setRefreshGallery(prev => prev + 1);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
      throw error;
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    if (!selectedOperation) {
      alert('Пожалуйста, выберите операцию обработки');
      return;
    }
    
    if (!user) {
      alert('Пожалуйста, войдите в систему');
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Сначала загружаем оригинал
      const uploadedImage = await uploadImage(selectedFile);
      console.log('Оригинал загружен:', uploadedImage);
      
      // Определяем эндпоинт и параметры
      let endpoint = '';
      let params = {};
      
      switch (selectedOperation.id) {
        case 'enhance_quality':
          endpoint = 'upscale';
          params = { scale: upscaleParams.scale || 2 };
          break;
        case 'style_transfer':
          endpoint = 'style_transfer';
          params = {
            style: styleTransferParams.style,
            alpha: styleTransferParams.alpha,
            preserve_color: styleTransferParams.preserve_color
          };
          break;
        case 'restore_portrait':
          endpoint = 'enhance';
          params = {
            fidelity_weight: restorePortraitParams.fidelity_weight,
            postprocess: restorePortraitParams.postprocess
          };
          break;
        case 'postprocess':
          endpoint = 'postprocess';
          params = postProcessParams;
          break;
        default:
          endpoint = 'process';
      }
      
      console.log('🔄 Отправка на обработку:', { endpoint, params });
      
      // Отправляем на обработку
      const result = await imageApi.process(endpoint, selectedFile, params);
      console.log('✅ Обработка завершена:', result.data);
      
      // Устанавливаем URL обработанного изображения
      if (result.data.url) {
        setProcessedUrl(`http://localhost:8080${result.data.url}`);
      } else if (result.data.processed_url) {
        setProcessedUrl(`http://localhost:8080${result.data.processed_url}`);
      }
      
      // Обновляем галерею
      setRefreshGallery(prev => prev + 1);
      
      alert('Изображение успешно обработано!');
      
    } catch (error) {
      console.error('❌ Ошибка обработки:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Ошибка обработки изображения';
      alert(`Ошибка: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    handleProcess();
  };

  const handleSelectOperation = (operation) => {
  console.log('=== Operation selected in App ===', operation);
  setSelectedOperation(operation);
};

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Временная отладочная панель */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs z-50 font-mono shadow-lg">
        <div className="font-bold mb-1">🔍 Состояние:</div>
        <div>📁 File: {selectedFile ? selectedFile.name : '❌ null'}</div>
        <div>⚙️ Op: {selectedOperation ? selectedOperation.name : '❌ null'}</div>
        <div>🔄 Proc: {isProcessing ? 'true' : 'false'}</div>
        <div>👤 User: {user ? '✅' : '❌'}</div>
        <button 
          onClick={() => {
            console.log('=== State ===');
            console.log('selectedFile:', selectedFile);
            console.log('selectedOperation:', selectedOperation);
            console.log('isProcessing:', isProcessing);
            console.log('user:', user);
          }}
          className="mt-2 bg-blue-600 px-2 py-1 rounded text-white text-xs w-full"
        >
          Log State
        </button>
      </div>
      <Header 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={logout} 
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка */}
          <div className="space-y-8">
            <UploadPanel onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 gap-8">
              <PreviewPanel 
                original={originalPreview} 
                processed={processedUrl} 
                isProcessing={isProcessing} 
              />
              
              <ControlsPanel
                selectedOperation={selectedOperation}
                onSelectOperation={handleSelectOperation}  // ← вместо setSelectedOperation
                onOperationParamsChange={handleOperationParamsChange}
              />
              
              <button
                onClick={handleProcessClick}
                disabled={!selectedFile || !selectedOperation || isProcessing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Обработка...
                  </span>
                ) : (
                  'Обработать изображение'
                )}
              </button>
            </div>
          </div>
          
          {/* Правая колонка - Галерея */}
          <Gallery user={user} refreshTrigger={refreshGallery} />
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  );
}
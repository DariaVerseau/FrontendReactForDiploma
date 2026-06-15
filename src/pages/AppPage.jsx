// src/pages/AppPage.jsx
import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { imageApi } from '../services/api';
import AuthModal from '../components/AuthModal';
import UploadPanel from '../components/UploadPanel';
import PreviewPanel from '../components/PreviewPanel';
import ControlsPanel from '../components/ControlsPanel';
import Gallery from '../components/Gallery';
import { ToastProvider, useToast } from '../components/ToastContainer';

// Внутренний компонент с логикой
function AppContent() {
  const { user, login, register, logout } = useAuth();
  const { showToast } = useToast(); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [originalImageId, setOriginalImageId] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [refreshGallery, setRefreshGallery] = useState(0);
  
  // Состояния для параметров операций
  const [upscaleParams, setUpscaleParams] = useState({ scale: 2 });
  const [styleTransferParams, setStyleTransferParams] = useState({ 
    style: 'vangogh', 
    alpha: 1.0, 
    preserve_color: false 
  });
  const [restorePortraitParams, setRestorePortraitParams] = useState({
    fidelity_weight: 0.5,
    postprocess: true,
    colorize: false
  });
  const [postProcessParams, setPostProcessParams] = useState({
    sharpness: 1.25,
    contrast: 1.12,
    brightness: 1.05,
    denoise: true
  });

  // Загружаем оригинал сразу при выборе файла
  const handleFileSelect = async (file) => {
    if (!file) {
      setSelectedFile(null);
      setOriginalPreview(null);
      setOriginalImageId(null);
      setProcessedUrl(null);
      return;
    }
    
    setSelectedFile(file);
    setProcessedUrl(null);
    setOriginalPreview(file);
    setOriginalImageId(null);
    
    if (user) {
      setIsUploading(true);
      try {
        const uploaded = await uploadImage(file);
        setOriginalImageId(uploaded.id);
        console.log('✅ Оригинал загружен, ID:', uploaded.id);
        showToast('Изображение загружено!', 'success');
      } catch (error) {
        console.error('❌ Ошибка загрузки оригинала:', error);
        showToast('Не удалось загрузить изображение', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleOperationParamsChange = (operationId, params) => {
    console.log('Params changed:', operationId, params);
    
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
    if (!originalImageId && !selectedFile) {
      showToast('Пожалуйста, выберите изображение', 'error');
      return;
    }
    
    if (!selectedOperation) {
      showToast('Пожалуйста, выберите операцию обработки', 'error');
      return;
    }
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!originalImageId && selectedFile) {
      setIsUploading(true);
      try {
        const uploaded = await uploadImage(selectedFile);
        setOriginalImageId(uploaded.id);
      } catch (error) {
        showToast('Не удалось загрузить изображение', 'error');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    
    setIsProcessing(true);
    
    try {
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
            postprocess: restorePortraitParams.postprocess,
            colorize: restorePortraitParams.colorize,
          };
          break;
        case 'postprocess':
          endpoint = 'postprocess';
          params = postProcessParams;
          break;
        default:
          endpoint = 'process';
      }
      
      console.log('🔄 Отправка на обработку:', { endpoint, params, imageId: originalImageId });
      
      const result = await imageApi.processWithImageId(endpoint, originalImageId, params);
      console.log('✅ Обработка завершена:', result.data);
      
      if (result.data.url) {
        setProcessedUrl(`http://localhost:8080/${result.data.url}`);
      } else if (result.data.processed_url) {
        const processedUrl = result.data.processed_url.startsWith('/') 
          ? result.data.processed_url 
          : `/${result.data.processed_url}`;
        setProcessedUrl(`http://localhost:8080${processedUrl}`);
      }
      
      setRefreshGallery(prev => prev + 1);
      showToast('Изображение успешно обработано!', 'success');
      
    } catch (error) {
      console.error('❌ Ошибка обработки:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Ошибка обработки изображения';
      showToast(errorMsg, 'error');
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
      <Header 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={logout} 
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <UploadPanel onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 gap-8">
              <PreviewPanel 
                original={originalPreview} 
                processed={processedUrl} 
                isProcessing={isProcessing || isUploading} 
              />
              
              <ControlsPanel
                selectedOperation={selectedOperation}
                onSelectOperation={handleSelectOperation}
                onOperationParamsChange={handleOperationParamsChange}
              />
              
              <button
                onClick={handleProcessClick}
                disabled={!selectedFile || !selectedOperation || isProcessing || isUploading}
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
                ) : isUploading ? (
                  'Загрузка изображения...'
                ) : (
                  'Обработать изображение'
                )}
              </button>
            </div>
          </div>
          
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

// Главный компонент с ToastProvider
export default function AppPage() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
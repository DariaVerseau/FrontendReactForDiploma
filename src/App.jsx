import { useState, useEffect } from 'react';
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
  const { user, login, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [postProcessParams, setPostProcessParams] = useState({
    sharpness: 1.25,
    contrast: 1.12,
    brightness: 1.05
  });

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setProcessedUrl(null);
  };

  const handlePostProcessParamChange = (key, value) => {
    setPostProcessParams(prev => ({ ...prev, [key]: value }));
  };

  const handleProcess = async () => {
    if (!selectedFile || !selectedOperation || !user) return;
    
    setIsProcessing(true);
    try {
      let params = {};
      
      if (selectedOperation.type === 'upscale') {
        params.scale = selectedOperation.param;
      } else if (selectedOperation.type === 'style_transfer') {
        params.style = selectedOperation.param;
      } else if (selectedOperation.type === 'postprocess') {
        params = postProcessParams;
      }
      
      const res = await imageApi.process(
        selectedOperation.type,
        selectedFile,
        params
      );
      
      setProcessedUrl(`http://localhost:8080${res.data.url}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка обработки');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FiImage />
            <span>Smart Image Lab</span>
          </div>
          <Header user={user} onLogin={login} onLogout={logout} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <UploadPanel onFileSelect={handleFileSelect} />
            
            <div className="grid grid-cols-1 gap-8">
              <PreviewPanel 
                original={selectedFile} 
                processed={processedUrl} 
                isProcessing={isProcessing} 
              />
              
              <ControlsPanel
                selectedOperation={selectedOperation}
                onSelectOperation={setSelectedOperation}
                postProcessParams={postProcessParams}
                onPostProcessParamChange={handlePostProcessParamChange}
              />
              
              <button
                onClick={handleProcess}
                disabled={!selectedFile || !selectedOperation || isProcessing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiImage className="spinner" /> Обработка...
                  </span>
                ) : (
                  'Обработать изображение'
                )}
              </button>
            </div>
          </div>
          
          {/* Right Column */}
          <Gallery user={user} />
        </div>
      </main>
    </div>
  );
}
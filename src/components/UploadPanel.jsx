import { useState, useRef } from 'react';
import { FiUpload, FiImage } from 'react-icons/fi';
import Button from './ui/Button';
import Card from './ui/Card';

export default function UploadPanel({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 10 МБ)');
      return;
    }
    onFileSelect(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiUpload /> Загрузить изображение
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <FiImage className="mx-auto text-3xl mb-2 text-indigo-600" />
        <p className="text-gray-600">Перетащите файл сюда</p>
        <p className="text-sm text-gray-500 mt-1">Или нажмите для выбора</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </Card>
  );
}
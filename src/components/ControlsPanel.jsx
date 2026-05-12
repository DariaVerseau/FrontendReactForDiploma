import { useState } from 'react';
import { 
  FiMaximize2, 
  FiStar, 
  FiSliders, 
  FiLayers,
  FiSun,
  FiSettings,
  FiFilter,
  FiArrowLeft
} from 'react-icons/fi';
import Button from './ui/Button';
import Card from './ui/Card';

// Все доступные стили для переноса
const STYLE_OPTIONS = [
  { id: 'vangogh', name: 'Ван Гог', image: '/styles/vangogh.jpg' },
  { id: 'picasso', name: 'Пикассо', image: '/styles/picasso.jpg' },
  { id: 'monet', name: 'Моне', image: '/styles/monet.jpg' },
  { id: 'monet2', name: 'Моне 2', image: '/styles/monet2.jpg' },
  { id: 'erinHanson', name: 'Эрин Хенсон', image: '/styles/erinHanson.jpg' },
  { id: 'antimonocromatismo', name: 'Анти-монохроматизм', image: '/styles/antimonocromatismo.jpg' },
  { id: 'asheville', name: 'Ашвилл', image: '/styles/asheville.jpg' },
  { id: 'brushstrokes', name: 'Мазки кисти', image: '/styles/brushstrokes.jpg' },
  { id: 'contrast_of_forms', name: 'Контраст форм', image: '/styles/contrast_of_forms.jpg' },
  { id: 'en_campo_gris', name: 'В поле серого', image: '/styles/en_campo_gris.jpg' },
  { id: 'goeritz', name: 'Гоэритц', image: '/styles/goeritz.jpg' },
  { id: 'impronte_d_artista', name: 'Отпечатки художника', image: '/styles/impronte_d_artista.jpg' },
  { id: 'la_muse', name: 'Ла Муза', image: '/styles/la_muse.jpg' },
  { id: 'mondrian_cropped', name: 'Мондриан (обрезанный)', image: '/styles/mondrian_cropped.jpg' },
  { id: 'picasso_seated_nude_hr', name: 'Пикассо (сидячий обнаженный)', image: '/styles/picasso_seated_nude_hr.jpg' },
  { id: 'picasso_self_portrait', name: 'Пикассо (автопортрет)', image: '/styles/picasso_self_portrait.jpg' },
  { id: 'scene_de_rue', name: 'Уличная сцена', image: '/styles/scene_de_rue.jpg' },
  { id: 'sketch', name: 'Эскиз', image: '/styles/sketch.jpg' },
  { id: 'the_resevoir_at_poitiers', name: 'Резервуар в Пуатье', image: '/styles/the_resevoir_at_poitiers.jpg' },
  { id: 'trial', name: 'Эксперимент', image: '/styles/trial.jpg' },
  { id: 'woman_in_peasant_dress_cropped', name: 'Женщина в крестьянском платье (обрезанная)', image: '/styles/woman_in_peasant_dress_cropped.jpg' },
  { id: 'woman_in_peasant_dress', name: 'Женщина в крестьянском платье', image: '/styles/woman_in_peasant_dress.jpg' },
  { id: 'woman_with_hat_matisse', name: 'Женщина с шляпой (Матисс)', image: '/styles/woman_with_hat_matisse.jpg' }
];

// Все типы операций
const OPERATIONS = [
  { 
    id: 'enhance_quality', 
    name: 'Улучшить качество', 
    icon: FiMaximize2, 
    type: 'enhance_quality',
    description: 'Увеличение разрешения изображения'
  },
  { 
    id: 'restore_portrait', 
    name: 'Восстановить портрет', 
    icon: FiStar, 
    type: 'enhance',
    description: 'Восстановление деталей лица и текстуры'
  },
  { 
    id: 'style_transfer', 
    name: 'Перенос стиля', 
    icon: FiLayers, 
    type: 'style_transfer',
    description: 'Применение художественного стиля к изображению'
  },
  { 
    id: 'postprocess', 
    name: 'Постобработка', 
    icon: FiSliders, 
    type: 'postprocess',
    description: 'Классическая постобработка изображения'
  }
];

// Параметры для операции "Восстановить портрет"
const RESTORE_PORTAIT_PARAMS = [
  {
    id: 'fidelity_weight',
    name: 'Баланс',
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.5,
    options: [
      { value: 0, label: '0 — приоритетом является качество, а не сохранение идентичности. Результат может быть более творческим, но есть риск изменения внешности объекта.' },
      { value: 0.3, label: '0,3 — высокое качество с умеренным сохранением идентичности.' },
      { value: 0.5, label: '0,5 — сбалансированное восстановление (значение по умолчанию).' },
      { value: 0.7, label: '0,7 — хорошее сохранение идентичности с улучшением качества.' },
      { value: 1, label: '1,0 — максимальная верность оригиналу, более консервативные изменения.' }
    ]
  },
  {
    id: 'postprocess',
    name: 'Постобработка',
    type: 'boolean',
    defaultValue: true,
    label: 'Применить классическую постобработку'
  }
];

// Параметры для операции "Перенос стиля"
const STYLE_TRANSFER_PARAMS = [
  {
    id: 'style',
    name: 'Стиль',
    type: 'select',
    options: STYLE_OPTIONS,
    defaultValue: 'vangogh'
  },
  {
    id: 'alpha',
    name: 'Сила стилизации',
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1.0
  },
  {
    id: 'preserve_color',
    name: 'Сохранять цвет оригинала',
    type: 'boolean',
    defaultValue: false
  }
];

// Параметры для операции "Постобработка"
const POST_PROCESS_PARAMS = [
  {
    id: 'sharpness',
    name: 'Резкость',
    type: 'slider',
    min: 0.0,
    max: 3.0,
    step: 0.05,
    defaultValue: 1.25
  },
  {
    id: 'contrast',
    name: 'Контраст',
    type: 'slider',
    min: 0.0,
    max: 2.0,
    step: 0.05,
    defaultValue: 1.12
  },
  {
    id: 'brightness',
    name: 'Яркость',
    type: 'slider',
    min: 0.0,
    max: 2.0,
    step: 0.05,
    defaultValue: 1.05
  },
  {
    id: 'denoise',
    name: 'Шумоподавление',
    type: 'boolean',
    defaultValue: true
  }
];

// Modal Component
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Выберите стиль</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Закрыть</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Style Gallery Modal Component
function StyleGalleryModal({ isOpen, onClose, onSelectStyle, selectedStyle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {STYLE_OPTIONS.map(style => (
          <div
            key={style.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
              selectedStyle === style.id ? 'border-indigo-600' : 'border-gray-200'
            }`}
            onClick={() => onSelectStyle(style.id)}
          >
            <div className="aspect-square overflow-hidden">
              {style.image ? (
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Нет изображения</span>
                </div>
              )}
            </div>
            <div className="p-2 bg-white">
              <p className="text-sm font-medium text-center">{style.name}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default function ControlsPanel({ 
  selectedOperation, 
  onSelectOperation,
  onOperationParamsChange
}) {
  const [selectedParams, setSelectedParams] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // Инициализируем параметры по умолчанию
  const initParams = (operationId) => {
    if (operationId === 'style_transfer') {
      return STYLE_TRANSFER_PARAMS.reduce((acc, param) => ({
        ...acc,
        [param.id]: param.defaultValue
      }), {});
    } else if (operationId === 'restore_portrait') {
      return RESTORE_PORTAIT_PARAMS.reduce((acc, param) => ({
        ...acc,
        [param.id]: param.defaultValue
      }), {});
    } else if (operationId === 'postprocess') {
      return POST_PROCESS_PARAMS.reduce((acc, param) => ({
        ...acc,
        [param.id]: param.defaultValue
      }), {});
    }
    return {};
  };

const handleOperationSelect = (operation) => {
  console.log('Operation clicked:', operation);
  
  if (operation.id === editingOperation?.id) {
    console.log('Deselecting operation');
    setIsEditing(false);
    setEditingOperation(null);
    if (onSelectOperation) {
      onSelectOperation(null);
    }
  } else {
    console.log('Selecting new operation:', operation);
    setIsEditing(true);
    setEditingOperation(operation);
    setSelectedParams(initParams(operation.id));
    // Не вызываем onSelectOperation здесь - только после нажатия "Применить"
  }
};

  const handleParamChange = (paramId, value) => {
    setSelectedParams(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

const handleApplyParams = () => {
  console.log('=== Apply Params ===');
  console.log('editingOperation:', editingOperation);
  console.log('selectedParams:', selectedParams);
  
  // ✅ КРИТИЧЕСКИ ВАЖНО: передаём выбранную операцию в родительский компонент
  if (onSelectOperation && editingOperation) {
    console.log('Calling onSelectOperation with:', editingOperation);
    onSelectOperation(editingOperation);
  } else {
    console.warn('onSelectOperation is not defined or editingOperation is null');
  }
  
  // Передаём параметры
  if (onOperationParamsChange && editingOperation) {
    onOperationParamsChange(editingOperation.id, selectedParams);
  }
  
  setIsEditing(false);
};

  // Render parameter controls based on operation type
  const renderParams = () => {
    if (!editingOperation) return null;
    
    if (editingOperation.id === 'enhance_quality') {
      return (
        <div className="space-y-4">
          <h4 className="font-medium mb-2">Выберите масштаб увеличения:</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleParamChange('scale', 2)}
              className={`px-3 py-2 rounded-lg font-medium text-center ${
                selectedParams.scale === 2 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Увеличить 2x
            </button>
            <button
              onClick={() => handleParamChange('scale', 4)}
              className={`px-3 py-2 rounded-lg font-medium text-center ${
                selectedParams.scale === 4 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Увеличить 4x
            </button>
          </div>
        </div>
      );
    }
    
    if (editingOperation.id === 'style_transfer') {
      return (
        <div className="space-y-4">
          {/* Кнопка для выбора стиля */}
          <div>
            <button
              onClick={() => setIsStyleModalOpen(true)}
              className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Выбрать стиль
            </button>
            {selectedParams.style && (
              <p className="mt-2 text-sm text-indigo-600">
                Выбранный стиль: {STYLE_OPTIONS.find(s => s.id === selectedParams.style)?.name}
              </p>
            )}
          </div>
          
          {/* Сила стилизации */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Сила стилизации
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedParams.alpha || 1.0}
              onChange={(e) => handleParamChange('alpha', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.0</span>
              <span>{selectedParams.alpha?.toFixed(1)}</span>
              <span>1.0</span>
            </div>
          </div>
          
          {/* Сохранять цвет оригинала */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="preserve_color"
              checked={selectedParams.preserve_color || false}
              onChange={(e) => handleParamChange('preserve_color', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="preserve_color" className="ml-2 block text-sm text-gray-700">
              Сохранять цвет оригинала
            </label>
          </div>
          
          <StyleGalleryModal
            isOpen={isStyleModalOpen}
            onClose={() => setIsStyleModalOpen(false)}
            onSelectStyle={(styleId) => {
              handleParamChange('style', styleId);
              setIsStyleModalOpen(false);
            }}
            selectedStyle={selectedParams.style}
          />
        </div>
      );
    }
    
    if (editingOperation.id === 'restore_portrait') {
      return (
        <div className="space-y-4">
          {/* Баланс */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Баланс качества и оригинала
            </label>
            <div className="flex items-center space-x-2">
              {RESTORE_PORTAIT_PARAMS[0].options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleParamChange('fidelity_weight', option.value)}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    selectedParams.fidelity_weight === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {RESTORE_PORTAIT_PARAMS[0].options.find(o => o.value === selectedParams.fidelity_weight)?.label}
            </div>
          </div>
          
          {/* Постобработка */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="postprocess"
              checked={selectedParams.postprocess || true}
              onChange={(e) => handleParamChange('postprocess', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="postprocess" className="ml-2 block text-sm text-gray-700">
              Применить классическую постобработку
            </label>
          </div>
        </div>
      );
    }
    
    if (editingOperation.id === 'postprocess') {
      return (
        <div className="space-y-4">
          {POST_PROCESS_PARAMS.map(param => (
            <div key={param.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {param.name}
              </label>
              {param.type === 'slider' ? (
                <>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={selectedParams[param.id] || param.defaultValue}
                    onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{param.min}</span>
                    <span>{selectedParams[param.id]?.toFixed(2) || param.defaultValue.toFixed(2)}</span>
                    <span>{param.max}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={param.id}
                    checked={selectedParams[param.id] || param.defaultValue}
                    onChange={(e) => handleParamChange(param.id, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={param.id} className="ml-2 block text-sm text-gray-700">
                    {param.label}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  const renderOperationButton = (operation) => (
    <Button
      key={operation.id}
      variant={editingOperation?.id === operation.id ? 'primary' : 'secondary'}
      onClick={() => handleOperationSelect(operation)}
      className="flex flex-col items-center gap-1 py-3 h-auto w-full"
    >
      <operation.icon size={18} />
      <span className="text-xs">{operation.name}</span>
    </Button>
  );

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Операции обработки</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {OPERATIONS.map(renderOperationButton)}
      </div>

      {isEditing && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <FiArrowLeft size={16} />
              </button>
              <h3 className="font-medium">{editingOperation.name}</h3>
            </div>
            <button
              onClick={handleApplyParams}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Применить
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-2">{editingOperation.description}</h4>
            {renderParams()}
          </div>
        </div>
      )}
    </Card>
  );
}
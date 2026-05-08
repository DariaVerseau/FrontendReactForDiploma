import { useState } from 'react';
import PropTypes from 'prop-types';

export default function SliderInput({ 
  label, 
  icon: Icon, 
  min, 
  max, 
  step, 
  defaultValue, 
  onChange 
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-indigo-600" />}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-indigo-600 font-mono w-12 text-right">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );
}

SliderInput.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onChange: PropTypes.func
};
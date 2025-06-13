import React from 'react';

const SatisfactionScale = ({ name, value, onChange, label, required = false }) => {
  const options = [
    { value: 'muito_satisfeito', label: 'Muito Satisfeito', color: 'bg-green-500' },
    { value: 'satisfeito', label: 'Satisfeito', color: 'bg-blue-500' },
    { value: 'regular', label: 'Regular', color: 'bg-yellow-500' },
    { value: 'ruim', label: 'Ruim', color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
              ${value === option.value 
                ? `${option.color} border-transparent text-white shadow-lg` 
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <span className="text-sm font-medium text-center">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SatisfactionScale;


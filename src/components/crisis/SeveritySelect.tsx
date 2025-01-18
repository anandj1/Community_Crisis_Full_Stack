import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface SeveritySelectProps {
  value: Severity;
  onChange: (severity: Severity) => void;
  disabled?: boolean;
}

const severityOptions = [
  {
    value: 'low',
    label: 'Low',
    description: 'Minor incident, no immediate danger',
    icon: AlertCircle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
    activeClassName: 'ring-yellow-500 border-yellow-500 bg-yellow-100'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Moderate risk, requires attention',
    icon: AlertTriangle,
    className: 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100',
    activeClassName: 'ring-orange-500 border-orange-500 bg-orange-100'
  },
  {
    value: 'high',
    label: 'High',
    description: 'Serious situation, urgent response needed',
    icon: AlertOctagon,
    className: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100',
    activeClassName: 'ring-red-500 border-red-500 bg-red-100'
  },
  {
    value: 'critical',
    label: 'Critical',
    description: 'Life-threatening emergency',
    icon: AlertOctagon,
    className: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
    activeClassName: 'ring-red-500 border-red-700 bg-red-700'
  }
] as const;

export function SeveritySelect({ value, onChange, disabled }: SeveritySelectProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Severity Level
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {severityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value as Severity)}
              disabled={disabled}
              className={`
                relative flex items-start p-4 rounded-lg border transition-all
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected 
                  ? `${option.activeClassName} ring-2 ring-offset-2` 
                  : `${option.className}`
                }
              `}
            >
              <div className="flex items-center">
                <Icon className={`h-5 w-5 ${option.value === 'critical' ? 'text-white' : ''} mr-3`} />
                <div className="text-left">
                  <p className={`font-medium ${option.value === 'critical' ? 'text-white' : 'text-gray-900'}`}>
                    {option.label}
                  </p>
                  <p className={`text-sm ${option.value === 'critical' ? 'text-white/90' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
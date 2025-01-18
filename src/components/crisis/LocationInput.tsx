import React from 'react';
import { MapPin, Search } from 'lucide-react';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  value: Location;
  onChange: (location: Location) => void;
  disabled?: boolean;
}

export function LocationInput({ value, onChange, disabled }: LocationInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="location" className="block text-sm font-semibold text-gray-900">
        Location
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          id="location"
          value={value.address}
          onChange={(e) =>
            onChange({
              ...value,
              address: e.target.value,
            })
          }
          className="block w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          placeholder="Enter the crisis location"
          required
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <p className="text-sm text-gray-500">Please provide a specific address or location description</p>
    </div>
  );
}
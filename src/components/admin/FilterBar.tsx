import React from 'react';
import { severityConfig, statusConfig } from '../../types/status';

interface Filters {
  search: string;
  severity: string;
  status: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[200px]">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search issues..."
        />
      </div>

      <div className="min-w-[200px]">
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
          Severity
        </label>
        <select
          id="severity"
          value={filters.severity}
          onChange={(e) => onChange({ ...filters, severity: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Severities</option>
          {Object.entries(severityConfig).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[200px]">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Statuses</option>
          {Object.entries(statusConfig).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[200px]">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="severity">Severity</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  );
}
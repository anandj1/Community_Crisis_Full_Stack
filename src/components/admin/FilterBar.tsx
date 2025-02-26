import React from 'react';

interface Filters {
  search: string;
  severity: string;
  status: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (updatedFilters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const handleChange = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* 🔍 Search Field */}
      <div className="min-w-[200px]">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          placeholder="Search issues..."
        />
      </div>

      {/* 🔥 Severity Filter (Matches Model) */}
      <div className="min-w-[200px]">
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
          Severity
        </label>
        <select
          id="severity"
          value={filters.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* 📌 Status Filter (Matches Model) */}
      <div className="min-w-[200px]">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* 🔄 Sort By Filter */}
      <div className="min-w-[200px]">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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

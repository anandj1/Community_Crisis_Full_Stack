import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { FilterBar } from './admin/FilterBar';
import { format, startOfToday, isSameDay } from 'date-fns';

interface Crisis {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'inProgress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  crises: Crisis[];
}

export function Dashboard({ crises }: DashboardProps) {
  const [filters, setFilters] = useState({
    search: '',
    severity: '',
    status: '',
    sortBy: 'newest',
  });

  const handleFilterChange = (updatedFilters: any) => {
    setFilters(updatedFilters);
  };

 
  const filteredCrises = crises
    .filter(c =>
      filters.search
        ? c.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.description?.toLowerCase().includes(filters.search.toLowerCase())
        : true
    )
    .filter(c => (filters.severity ? c.severity === filters.severity : true))
    .filter(c => (filters.status ? c.status === filters.status : true))
    .sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (filters.sortBy === 'severity') return b.severity.localeCompare(a.severity);
      if (filters.sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'MMM dd');
  }).reverse();

 
  const criticalData = last7Days.map(date =>
    crises.filter(c =>
      format(new Date(c.createdAt), 'MMM dd') === date && c.severity === 'critical'
    ).length
  );


  const resolvedToday = crises.filter(crisis => {
    if (crisis.status !== 'resolved') return false;
    const today = startOfToday();
    const updateDate = new Date(crisis.updatedAt);
    return isSameDay(updateDate, today);
  }).length;

 
  const doughnutData = {
    labels: ['Reported', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [
          crises.filter(c => c.status === 'reported').length || 0.1,
          crises.filter(c => c.status === 'inProgress').length || 0.1,
          crises.filter(c => c.status === 'resolved').length || 0.1
        ],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(234, 179, 8)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // ✅ Line Chart Data for Critical Incidents
  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Critical Incidents',
        data: criticalData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Current Status Distribution',
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Crisis Dashboard</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Data
        </button>
      </div>

      
      <FilterBar filters={filters} onChange={handleFilterChange} />

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Active</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {crises.filter(c => c.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Critical</h3>
          <p className="text-3xl font-bold text-red-600">
            {crises.filter(c => c.severity === 'critical' && c.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-600">{resolvedToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Incidents Trend</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}

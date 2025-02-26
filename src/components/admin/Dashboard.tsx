import React, { useState } from 'react';
import { StatsOverview } from './StatsOverview';
import { IssuesList } from './IssuesList';
import { FilterBar } from './FilterBar';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, isToday } from 'date-fns';
import { statusConfig } from '../../types/status';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  total: number;
  resolved: number;
  resolvedToday: number;
  pending: number;
  avgResponseTime: string;
}

interface Filters {
  search: string;
  severity: string;
  status: string;
  sortBy: string;
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    severity: '',
    status: '',
    sortBy: 'newest'
  });
  
  // Mock data - in a real app, this would come from your API
  const [stats] = useState<DashboardStats>({
    total: 44,
    resolved: 28, // Total resolved issues (all time)
    resolvedToday: 3, // Issues resolved today
    pending: 16,
    avgResponseTime: '2h 15m'
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Prepare data for charts
  const last7Days = [...Array(7)].map((_, i) => format(subDays(new Date(), i), 'MMM dd')).reverse();
  
  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Critical Issues',
        data: last7Days.map(() => Math.floor(Math.random() * 10)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'High Priority Issues',
        data: last7Days.map(() => Math.floor(Math.random() * 15)),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const barChartData = {
    labels: Object.values(statusConfig).map(config => config.label),
    datasets: [{
      label: 'Issues by Status',
      data: [12, 19, 8, 5],
      backgroundColor: Object.values(statusConfig).map(config => config.bgColor)
    }]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crisis Management Dashboard</h1>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
      
      <StatsOverview stats={stats} loading={false} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Trends</h3>
          <Line data={lineChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }} />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Status</h3>
          <Bar data={barChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['overview', 'performance', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedView(tab)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${selectedView === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            <FilterBar filters={filters} onChange={handleFilterChange} />
            <div className="mt-6">
              <IssuesList issues={[]} loading={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

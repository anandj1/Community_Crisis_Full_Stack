import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface DashboardProps {
  crises: any[];
}

export function Dashboard({ crises }: DashboardProps) {
  const [last7Days, setLast7Days] = useState<string[]>([]);

  useEffect(() => {
    setLast7Days([...Array(7)].map((_, i) => format(subDays(new Date(), i), 'MMM dd')).reverse());
  }, []);

  // Count critical issues by date
  const criticalData = last7Days.map(date =>
    crises.filter(c =>
      format(new Date(c.createdAt), 'MMM dd') === date && c.severity === 'critical'
    ).length
  );

  // Track issue statuses
  const recordedCount = crises.filter(c => c.status === 'recorded').length;
  const inProgressCount = crises.filter(c => c.status === 'in_progress').length;
  const resolvedCount = crises.filter(c => c.status === 'resolved').length;

  // Fix: Count all resolved issues today
  const resolvedTodayCount = crises.filter(
    c => c.status === 'resolved' && format(new Date(c.updatedAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Critical Incidents',
        data: criticalData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const statusChartData = {
    labels: ['Recorded', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Issues by Status',
        data: [recordedCount, inProgressCount, resolvedCount],
        backgroundColor: ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(34, 197, 94)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Critical Incidents Trend (Last 7 Days)' },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crisis Dashboard</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Active</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {crises.filter(c => c.status !== 'resolved').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Critical Issues</h3>
          <p className="text-3xl font-bold text-red-600">
            {crises.filter(c => c.severity === 'critical' && c.status !== 'resolved').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-600">{resolvedTodayCount}</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Trends</h3>
          <Line options={options} data={lineChartData} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Status</h3>
          <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={statusChartData} />
        </div>
      </div>
    </div>
  );
}

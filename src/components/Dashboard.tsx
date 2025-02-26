import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { FilterBar } from './admin/FilterBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, startOfToday, isSameDay, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  crises: any[];
  userId: string;
}

export function Dashboard({ crises, userId }: DashboardProps) {
  const [statusData, setStatusData] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const newStatusData = {
      reported: crises.filter(c => c.status === 'reported').length,
      inProgress: crises.filter(c => c.status === 'inProgress').length,
      resolved: crises.filter(c => c.status === 'resolved').length
    };

    console.log("Updated Status Data:", newStatusData);
    setStatusData(newStatusData);
  }, [crises]);

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

  // Updated resolvedToday calculation
  const resolvedToday = crises.filter(crisis => {
    if (crisis.status !== 'resolved') return false;
    const today = startOfToday();
    // Parse the resolvedAt date if it exists, otherwise fall back to updatedAt
    const resolvedDate = crisis.resolvedAt ? parseISO(crisis.resolvedAt) : parseISO(crisis.updatedAt);
    return isSameDay(resolvedDate, today);
  }).length;

  const doughnutData = {
    labels: ['Reported', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [
          statusData.reported || 0.1,
          statusData.inProgress || 0.1,
          statusData.resolved || 0.1
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
    <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Crisis Dashboard</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

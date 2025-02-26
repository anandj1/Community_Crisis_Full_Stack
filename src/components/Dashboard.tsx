import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, startOfToday, isSameDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

  // Calculate status statistics
  useEffect(() => {
    const newStatusData = {
      reported: crises.filter(c => c.status === 'reported').length,
      inProgress: crises.filter(c => c.status === 'in_progress').length,
      resolved: crises.filter(c => c.status === 'resolved').length
    };
    setStatusData(newStatusData);
  }, [crises]);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'MMM dd');
  }).reverse();

  // Critical incidents trend data
  const criticalData = last7Days.map(date => 
    crises.filter(c => 
      format(new Date(c.createdAt), 'MMM dd') === date && 
      c.severity === 'critical'
    ).length
  );

  // Status trend data
  const statusTrendData = last7Days.map(date => ({
    reported: crises.filter(c => 
      format(new Date(c.createdAt), 'MMM dd') === date && 
      c.status === 'reported'
    ).length,
    inProgress: crises.filter(c => 
      format(new Date(c.updatedAt), 'MMM dd') === date && 
      c.status === 'in_progress'
    ).length,
    resolved: crises.filter(c => 
      format(new Date(c.updatedAt), 'MMM dd') === date && 
      c.status === 'resolved'
    ).length,
  }));

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

  const statusChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Reported',
        data: statusTrendData.map(d => d.reported),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
      },
      {
        label: 'In Progress',
        data: statusTrendData.map(d => d.inProgress),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Resolved',
        data: statusTrendData.map(d => d.resolved),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const doughnutData = {
    labels: ['Reported', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [statusData.reported, statusData.inProgress, statusData.resolved],
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

  // Get today's resolved issues count
  const resolvedToday = crises.filter(crisis => {
    if (crisis.status !== 'resolved') return false;
    const today = startOfToday();
    const updateDate = new Date(crisis.updatedAt);
    return isSameDay(updateDate, today);
  }).length;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Active</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {crises.filter(c => c.status !== 'resolved').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Critical</h3>
          <p className="text-3xl font-bold text-red-600">
            {crises.filter(c => c.severity === 'critical' && c.status !== 'resolved').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 shadow-lg bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-600">
            {resolvedToday}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
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

      {/* Status Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Trends</h3>
        <Line data={statusChartData} options={chartOptions} />
      </div>
    </div>
  );
}

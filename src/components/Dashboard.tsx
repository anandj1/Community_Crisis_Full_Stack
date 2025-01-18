import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  crises: any[];
  userId: string;
}

export function Dashboard({ crises, userId }: DashboardProps) {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'MMM dd');
  }).reverse();

  const criticalData = last7Days.map(date => 
    crises.filter(c => 
      format(new Date(c.createdAt), 'MMM dd') === date && 
      c.severity === 'critical'
    ).length
  );

  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Critical Incidents',
        data: criticalData,
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Critical Incidents Trend',
      },
    },
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Active</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {crises.filter(c => c.status !== 'resolved').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Critical</h3>
          <p className="text-3xl font-bold text-red-600">
            {crises.filter(c => c.severity === 'critical' && c.status !== 'resolved').length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-600">
            {crises.filter(c => 
              c.status === 'resolved' && 
              format(new Date(c.updatedAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            ).length}
          </p>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6 shadow-lg">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
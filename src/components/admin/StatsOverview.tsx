import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

interface Stats {
  total: number;
  resolved: number;
  resolvedToday: number;
  pending: number;
  avgResponseTime: string;
}

interface StatsOverviewProps {
  stats: Stats;
  loading?: boolean;
}

export function StatsOverview({ stats, loading }: StatsOverviewProps) {
  const items = [
    {
      name: 'Total Issues',
      value: stats.total,
      icon: AlertTriangle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Resolved Today',
      value: stats.resolvedToday,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      name: 'Pending',
      value: stats.pending,
      icon: Clock,  
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Avg Response Time',
      value: stats.avgResponseTime,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.name}
          className="relative bg-white overflow-hidden rounded-lg shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon
                  className={`h-6 w-6 ${item.color}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className={`absolute bottom-0 inset-x-0 ${item.bgColor} h-1`} />
        </div>
      ))}
    </div>
  );
}

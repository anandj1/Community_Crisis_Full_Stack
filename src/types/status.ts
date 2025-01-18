export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'reported' | 'inProgress' | 'resolved';

export const severityConfig = {
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-200 hover:border-red-300',
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-200 hover:border-orange-300',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-200 hover:border-yellow-300',
  },
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-200 hover:border-green-300',
  },
} as const;

export const statusConfig = {
  reported: {
    label: 'Reported',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-200 hover:border-red-300',
    bgColor: 'rgba(239, 68, 68, 0.8)',
  },
  inProgress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-200 hover:border-blue-300',
    bgColor: 'rgba(245, 158, 11, 0.8)',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-200 hover:border-green-300',
    bgColor: 'rgba(16, 185, 129, 0.8)',
  }
} as const;
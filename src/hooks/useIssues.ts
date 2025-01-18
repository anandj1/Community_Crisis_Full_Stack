import { useState, useEffect } from 'react';
import { crisisApi } from '../services/api/crisis';

interface Filters {
  search: string;
  severity: string;
  status: string;
  sortBy: string;
}

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    severity: '',
    status: '',
    sortBy: 'newest'
  });

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    avgResponseTime: '0h'
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await crisisApi.getAllCrises(filters);
        setIssues(data);
        
        // Calculate stats
        const resolved = data.filter(issue => issue.status === 'resolved').length;
        setStats({
          total: data.length,
          resolved,
          pending: data.length - resolved,
          avgResponseTime: calculateAvgResponseTime(data)
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filters]);

  return {
    issues,
    filters,
    setFilters,
    stats,
    loading,
    error
  };
}

function calculateAvgResponseTime(issues) {
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
  if (resolvedIssues.length === 0) return '0h';

  const totalTime = resolvedIssues.reduce((acc, issue) => {
    const created = new Date(issue.createdAt);
    const resolved = new Date(issue.updatedAt);
    return acc + (resolved.getTime() - created.getTime());
  }, 0);

  const avgHours = Math.round(totalTime / (resolvedIssues.length * 1000 * 60 * 60));
  return `${avgHours}h`;
}
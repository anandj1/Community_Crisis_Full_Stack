import type { Crisis as BaseCrisis } from '../../types';

export type Crisis = BaseCrisis;

export type CrisisStatus = 'reported' | 'inProgress' | 'resolved';
export type CrisisSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface StatusColors {
  [key: string]: string;
}

export interface CrisisCardProps {
  crisis: Crisis;
  isAdmin?: boolean;
  onRefresh?: () => void;
}
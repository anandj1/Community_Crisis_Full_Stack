import React from 'react';
import { StatusDropdown } from '../admin/StatusDropdown';
import { cn } from '../../utils/cn';
import { Status, statusConfig } from '../../types/status';

interface CrisisStatusProps {
  status: Status;
  isAdmin?: boolean;
  onStatusChange?: (status: Status) => Promise<void>;
  disabled?: boolean;
}

export function CrisisStatus({ status, isAdmin, onStatusChange, disabled }: CrisisStatusProps) {
  const config = statusConfig[status];

  if (isAdmin && onStatusChange) {
    return <StatusDropdown currentStatus={status} onStatusChange={onStatusChange} disabled={disabled} />;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2',
        config.color,
        config.borderColor
      )}
    >
      {config.label}
    </span>
  );
}
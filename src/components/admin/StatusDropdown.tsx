import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Status, statusConfig } from '../../types/status';

interface StatusDropdownProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => Promise<void>;
  disabled?: boolean;
}

export function StatusDropdown({ currentStatus, onStatusChange, disabled }: StatusDropdownProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(true);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isChanging) return;

    const newStatus = e.target.value as Status;
    
    try {
      setIsChanging(true);
      await onStatusChange(newStatus);
      setNotificationSuccess(true);
      setShowNotification(true);
    } catch (error) {
      console.error('Failed to update status:', error);
      setNotificationSuccess(false);
      setShowNotification(true);
    } finally {
      setIsChanging(false);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Ensure we have a valid status, fallback to 'reported' if not
  const validStatus = Object.keys(statusConfig).includes(currentStatus) ? currentStatus : 'reported';
  const config = statusConfig[validStatus];

  return (
    <div className="relative inline-block">
      <select
        value={validStatus}
        onChange={handleChange}
        disabled={disabled || isChanging}
        className={cn(
          "appearance-none px-3 py-1.5 pr-8 text-sm font-medium rounded-full border-2 transition-colors cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          disabled && "opacity-50 cursor-not-allowed",
          config.color,
          config.borderColor
        )}
      >
        {Object.entries(statusConfig).map(([value, config]) => (
          <option key={value} value={value}>
            {config.label}
          </option>
        ))}
      </select>

      {isChanging && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      )}

      {showNotification && (
        <div
          className={cn(
            "absolute top-full mt-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 flex items-center gap-2 whitespace-nowrap",
            notificationSuccess
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          {notificationSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Status updated successfully
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              Failed to update status
            </>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ImageGallery } from './shared/ImageGallery';
import { CrisisStatus } from './crisis/CrisisStatus';
import { crisisService } from '../services/crisisService';
import type { Crisis } from '../types/crisis';
import { Status } from '../types/status';

interface CrisisCardProps {
  crisis: Crisis;
  isAdmin?: boolean;
  onRefresh?: () => void;
  view?: 'grid' | 'list';
}

export function CrisisCard({ crisis, isAdmin, onRefresh, view }: CrisisCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<Status>(crisis.status);

  const handleStatusUpdate = async (newStatus: Status) => {
    if (!crisis.id || updating) return;
    
    try {
      setError(null);
      setUpdating(true);
      await crisisService.updateStatus(crisis.id, newStatus);
      setLocalStatus(newStatus);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update status');
      setLocalStatus(crisis.status);
    } finally {
      setUpdating(false);
    }
  };

  const severityColors = {
    low: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
    medium: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    high: 'bg-red-50 text-red-700 ring-red-600/20',
    critical: 'bg-red-600 text-white'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 h-full ${updating ? 'opacity-60' : ''}`}>
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 rounded-t-xl flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${severityColors[crisis.severity]}`}>
                <AlertCircle className="h-3 w-3" />
                {crisis.severity.charAt(0).toUpperCase() + crisis.severity.slice(1)}
              </span>
              <CrisisStatus
                status={localStatus}
                isAdmin={isAdmin}
                onStatusChange={handleStatusUpdate}
                disabled={updating}
              />
            </div>
            <h3 className="text-base font-semibold leading-6 text-gray-900 truncate">{crisis.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{crisis.location.address}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-2">{crisis.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <time dateTime={crisis.createdAt}>
                {new Date(crisis.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>

          {crisis.media && crisis.media.length > 0 && (
            <button
              onClick={() => setShowGallery(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <ImageIcon className="h-4 w-4" />
              {crisis.media.length} {crisis.media.length === 1 ? 'image' : 'images'}
            </button>
          )}
        </div>
      </div>

      {showGallery && crisis.media && (
        <ImageGallery
          images={crisis.media}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CrisisForm } from './crisis/CrisisForm';
import { crisisApi } from '../services/api/crisis';
import type { CrisisFormData } from '../types';

interface CrisisReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisReportModal({ isOpen, onClose }: CrisisReportModalProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CrisisFormData) => {
    try {
      setError('');
      setIsSubmitting(true);
      
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.location.address.trim()) {
        throw new Error('Location is required');
      }

      // Submit crisis report
      await crisisApi.reportCrisis(formData);
      onClose();
      window.location.reload(); // Refresh to show new crisis
    } catch (err) {
      console.error('Crisis submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to report crisis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Report Crisis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <CrisisForm onSubmit={handleSubmit} disabled={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
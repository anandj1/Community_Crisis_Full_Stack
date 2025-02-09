import React, { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { MediaUpload } from '../MediaUpload';
import { MediaPreview, CloudMediaPreview } from '../MediaPreview';
import type { CrisisFormData, CrisisMedia, Severity, Location } from '../../types';
import { SeveritySelect } from './SeveritySelect';
import { LocationInput } from './LocationInput';

interface CrisisFormProps {
  onSubmit: (data: CrisisFormData) => Promise<void>;
  disabled?: boolean;
}

export function CrisisForm({ onSubmit, disabled }: CrisisFormProps) {
  const [formData, setFormData] = useState<Omit<CrisisFormData, 'media'>>({
    title: '',
    description: '',
    location: {
      address: '',
      lat: 0,
      lng: 0,
    },
    severity: 'medium',
  });

  const [mediaFiles, setMediaFiles] = useState<(File | CrisisMedia)[]>([]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.location.address.trim()) {
        throw new Error('Location is required');
      }

      // Create the submission data
      const submissionData: CrisisFormData = {
        ...formData,
        media: mediaFiles.filter((file): file is File => file instanceof File)
      };

      await onSubmit(submissionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit crisis report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      if (mediaFiles.length + newFiles.length > 5) {
        setError('Maximum 5 files allowed');
        return;
      }
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationChange = (location: Location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSeverityChange = (severity: Severity) => {
    setFormData(prev => ({
      ...prev,
      severity
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-1">
                Crisis Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter a clear, descriptive title"
                required
                disabled={disabled || isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Provide detailed information about the situation"
                required
                disabled={disabled || isSubmitting}
              />
              <p className="mt-1.5 text-sm text-gray-500 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Include relevant details about the crisis situation
              </p>
            </div>

            <LocationInput
              value={formData.location}
              onChange={handleLocationChange}
              disabled={disabled || isSubmitting}
            />

            <SeveritySelect
              value={formData.severity}
              onChange={handleSeverityChange}
              disabled={disabled || isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Evidence</h3>
          <MediaUpload onUpload={handleMediaUpload} disabled={disabled || isSubmitting} />
          
          {mediaFiles.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {mediaFiles.map((file, index) => (
                file instanceof File ? (
                  <MediaPreview
                    key={index}
                    file={file}
                    onRemove={() => handleRemoveMedia(index)}
                    disabled={disabled || isSubmitting}
                  />
                ) : (
                  <CloudMediaPreview
                    key={file.public_id}
                    media={file}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`
          w-full flex justify-center items-center py-3 px-4 rounded-lg
          text-white font-semibold transition-all duration-200
          ${isSubmitting || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
          shadow-sm hover:shadow-md
        `}
        disabled={disabled || isSubmitting}
      >
        <AlertTriangle className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Submitting...' : 'Report Crisis'}
      </button>
    </form>
  );
}
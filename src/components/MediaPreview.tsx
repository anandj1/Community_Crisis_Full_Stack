import React, { useState, useEffect } from 'react';
import { X, FileImage, Film, AlertCircle } from 'lucide-react';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export function MediaPreview({ file, onRemove, disabled }: MediaPreviewProps) {
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onload = () => {
      setPreview(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      setError(true);
      setLoading(false);
    };
    reader.readAsDataURL(file);

    return () => {
      reader.abort();
      URL.revokeObjectURL(preview);
    };
  }, [file]);

  if (loading) {
    return (
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-red-50 rounded-lg border border-red-200 p-4 flex items-center justify-center h-40">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-500">Failed to load preview</p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    );
  }

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="relative group rounded-lg overflow-hidden">
      {isImage ? (
        <img
          src={preview}
          alt={file.name}
          className="w-full h-40 object-cover"
          onError={() => setError(true)}
        />
      ) : isVideo ? (
        <video
          src={preview}
          className="w-full h-40 object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-40 bg-gray-50 flex items-center justify-center">
          <FileImage className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm 
                   opacity-0 group-hover:opacity-100 transition-all duration-200
                   hover:bg-white"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      )}
      
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <p className="text-xs text-white truncate">{file.name}</p>
      </div>
    </div>
  );
}
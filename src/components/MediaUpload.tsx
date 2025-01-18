import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface MediaUploadProps {
  onUpload: (files: FileList | null) => void;
  disabled?: boolean;
}

export function MediaUpload({ onUpload, disabled }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (!disabled && e.dataTransfer.files) {
        onUpload(e.dataTransfer.files);
      }
    },
    [onUpload, disabled]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files) {
      onUpload(e.target.files);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
        ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-indigo-500 hover:bg-indigo-50'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="media-upload"
        multiple
        accept="image/*, video/mp4,video/quicktime"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <label
        htmlFor="media-upload"
        className={`cursor-pointer flex flex-col items-center ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        <Upload className={`h-12 w-12 mb-3 ${dragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
        <span className="text-sm text-gray-600 text-center">
          {dragActive ? (
            "Drop files here"
          ) : (
            <>
              Drag and drop or click to upload<br />
              images and videos
            </>
          )}
        </span>
        <span className="text-xs text-gray-500 mt-1">
          Maximum 5 files (Images: JPG, PNG / Videos: MP4, MOV)
        </span>
      </label>
    </div>
  );
}
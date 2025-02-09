import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CrisisMedia } from '../../types';

interface ImageGalleryProps {
  images: CrisisMedia[];
  onClose: () => void;
}

export function ImageGallery({ images, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentMedia = images[currentIndex];
  const mediaUrl = currentMedia.secure_url || currentMedia.url;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        onClick={handlePrevious}
        className="absolute left-4 text-white hover:text-gray-300"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 text-white hover:text-gray-300"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="max-w-4xl max-h-[80vh] relative">
        {currentMedia.type === 'image' ? (
          <img
            src={mediaUrl}
            alt={currentMedia.public_id || 'Crisis image'}
            className="max-w-full max-h-[80vh] object-contain"
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            className="max-w-full max-h-[80vh]"
          />
        )}
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
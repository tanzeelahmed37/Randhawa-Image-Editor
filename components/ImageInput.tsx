import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PhotoIcon, ZoomInIcon, ZoomOutIcon, ArrowPathIcon } from './Icons';

interface ImageInputProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageChange, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Reset zoom and pan when image changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [previewUrl]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  }, [onImageChange]);

  const dropzoneClasses = `relative flex justify-center items-center w-full h-64 px-6 py-10 border-2 border-dashed rounded-lg transition-colors duration-300 cursor-pointer ${
    isDragging ? 'border-purple-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'
  }`;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev * 1.2, 5));
  }
  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev / 1.2, 1));
  }
  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale === 1) return;
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPanning || scale === 1) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsPanning(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload Image
      </label>
      {previewUrl ? (
        <div className="relative group">
          <div
            className="w-full h-64 rounded-lg bg-gray-900 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <img
              src={previewUrl}
              alt="Preview"
              draggable="false"
              className="w-full h-full object-contain"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
            />
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 bg-gray-900/70 backdrop-blur-sm p-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleZoomIn} title="Zoom In" className="p-1 text-white hover:bg-gray-700 rounded-md">
              <ZoomInIcon className="w-5 h-5" />
            </button>
            <button onClick={handleZoomOut} title="Zoom Out" disabled={scale <= 1} className="p-1 text-white hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              <ZoomOutIcon className="w-5 h-5" />
            </button>
            <button onClick={handleResetZoom} title="Reset Zoom" disabled={scale === 1 && position.x === 0 && position.y === 0} className="p-1 text-white hover:bg-gray-700 rounded-md disabled:opacity-50">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>

          <div
            onClick={() => onImageChange(null)}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg"
          >
            <span className="text-white font-semibold">Change Image</span>
          </div>
        </div>
      ) : (
        <div
          className={dropzoneClasses}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer"></label>
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
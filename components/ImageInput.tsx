
import React, { useState, useCallback } from 'react';
import { PhotoIcon } from './Icons';

interface ImageInputProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageChange, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload Image
      </label>
      {previewUrl ? (
        <div className="relative group">
          <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain rounded-lg bg-gray-900" />
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

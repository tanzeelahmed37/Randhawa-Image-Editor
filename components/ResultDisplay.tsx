
import React from 'react';
import { LoadingSpinner, PhotoIcon } from './Icons';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, error }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900 rounded-lg p-4">
      {isLoading && (
        <div className="text-center text-gray-400">
          <LoadingSpinner className="animate-spin h-12 w-12 text-purple-400 mx-auto" />
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
          <h3 className="font-bold text-lg">An Error Occurred</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && imageUrl && (
        <div className="w-full h-full">
            <h2 className="text-xl font-bold mb-4 text-center">Generated Image</h2>
            <img src={imageUrl} alt="Generated result" className="max-w-full max-h-[calc(100%-40px)] object-contain mx-auto rounded-lg" />
        </div>
      )}

      {!isLoading && !error && !imageUrl && (
        <div className="text-center text-gray-500">
          <PhotoIcon className="mx-auto h-16 w-16" />
          <h3 className="mt-4 text-xl font-semibold">Your Edited Image Will Appear Here</h3>
          <p className="mt-1 text-sm">Upload an image and provide a prompt to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;

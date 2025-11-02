
import React from 'react';
import { LoadingSpinner, PhotoIcon, DownloadIcon } from './Icons';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, error }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'randhawa-edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="w-full h-full flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-center flex-shrink-0">Generated Image</h2>
          <div className="relative flex-grow w-full min-h-0">
            <img src={imageUrl} alt="Generated result" className="absolute inset-0 w-full h-full object-contain mx-auto rounded-lg" />
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 flex-shrink-0 w-full max-w-xs flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
            Download Image
          </button>
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
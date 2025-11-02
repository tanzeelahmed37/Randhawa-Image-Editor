
import React, { useState, useEffect, useCallback } from 'react';
import ImageInput from './components/ImageInput';
import ResultDisplay from './components/ResultDisplay';
import { fileToBase64 } from './utils/fileUtils';
import { editImage } from './services/geminiService';
import { LoadingSpinner } from './components/Icons';

const DEFAULT_PROMPT = `A confident man standing stylishly outdoors, wearing a light pink buttoned shirt and dark grey formal trousers, holding a matching grey coat over his arm. He is posing beside a modern building with light-colored walls and arched architecture. He is wearing sunglasses, has neatly styled short hair, and a well-groomed beard. Replace the current face with my face while keeping the outfit, pose, background, and lighting the same.`;

export default function App() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!originalFile) {
      setOriginalPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(originalFile);
    setOriginalPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [originalFile]);

  const handleGenerate = useCallback(async () => {
    if (!originalFile || !prompt) {
      setError("Please provide an image and a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalFile);
      const resultImageUrl = await editImage(base64, mimeType, prompt);
      setGeneratedImageUrl(resultImageUrl);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, prompt]);
  
  const handleReset = () => {
    setOriginalFile(null);
    setGeneratedImageUrl(null);
    setError(null);
    setPrompt(DEFAULT_PROMPT);
  };

  const canGenerate = originalFile && prompt && !isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Gemini Image Editor
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Transform your images with the power of AI.
        </p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
          <ImageInput onImageChange={setOriginalFile} previewUrl={originalPreviewUrl} />
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Editing Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter..."
              className="w-full h-48 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="mt-auto flex flex-col sm:flex-row gap-4">
             <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </button>
             <button
              onClick={handleReset}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors duration-200"
            >
              Start Over
            </button>
          </div>

        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <ResultDisplay imageUrl={generatedImageUrl} isLoading={isLoading} error={error} />
        </div>
      </main>

       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
}

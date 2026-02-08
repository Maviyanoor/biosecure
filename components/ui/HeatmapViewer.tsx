'use client';

import { useState } from 'react';

interface HeatmapViewerProps {
  frames: Array<{
    id: string;
    timestamp: string;
    imageUrl: string;
    heatmapUrl?: string;
  }>;
  showHeatmap: boolean;
}

export default function HeatmapViewer({ frames, showHeatmap }: HeatmapViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextFrame = () => {
    setCurrentIndex((prev) => (prev + 1) % frames.length);
  };

  const prevFrame = () => {
    setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length);
  };

  const goToFrame = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % frames.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Frame Analysis</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors duration-200"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4">
        {frames[currentIndex] ? (
          <div className="relative w-full h-full">
            <img
              src={frames[currentIndex].imageUrl}
              alt={`Frame at ${frames[currentIndex].timestamp}`}
              className="w-full h-full object-contain"
            />
            {showHeatmap && frames[currentIndex].heatmapUrl && (
              <img
                src={frames[currentIndex].heatmapUrl}
                alt={`Heatmap overlay for frame at ${frames[currentIndex].timestamp}`}
                className="absolute top-0 left-0 w-full h-full object-contain opacity-60 mix-blend-overlay"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No frames available
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {frames[currentIndex]?.timestamp || '00:00'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prevFrame}
          disabled={frames.length <= 1}
          className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={frames.length - 1}
              value={currentIndex}
              onChange={(e) => goToFrame(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>00:00</span>
              <span>{frames.length > 0 ? frames[frames.length - 1]?.timestamp : '00:00'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={nextFrame}
          disabled={frames.length <= 1}
          className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 mt-4 max-h-24 overflow-y-auto">
        {frames.map((frame, index) => (
          <button
            key={frame.id}
            onClick={() => goToFrame(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              index === currentIndex
                ? 'border-cyan-500 scale-105'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <img
              src={frame.imageUrl}
              alt={`Thumbnail for ${frame.timestamp}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-0.5">
              {frame.timestamp}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
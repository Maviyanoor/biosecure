'use client';

import { useState } from 'react';
import {
  Upload,
  FileVideo,
  FileImage,
  Link as LinkIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { analysisService } from '@/lib/analysisService';
import ClientWrapper from '@/components/ui/ClientWrapper';

export default function AnalyzePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'url'>('video');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    // Validate
    if (!file && activeTab !== 'url') {
      alert('Please upload a file first!');
      return;
    }
    if (activeTab === 'url' && !url.trim()) {
      alert('Please enter a URL!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => (prev >= 95 ? 95 : prev + 5));
    }, 200);

    try {
      const result = await analysisService.analyzeMedia({
        // Pass undefined instead of null
        file: activeTab !== 'url' ? file ?? undefined : undefined,
        url: activeTab === 'url' ? url : undefined,
        type: activeTab,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Navigate to results page
      router.push(`/results/${result.sessionId}`);
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setAnalysisProgress(0);
      setIsAnalyzing(false);
      alert('Analysis failed. Please try again.');
    }
  };

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Deepfake{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Analyzer
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your media for comprehensive biological signal analysis
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 mb-8 max-w-2xl mx-auto border border-slate-700">
            <div className="flex">
              {[
                { id: 'video', label: 'Video Upload', icon: FileVideo },
                { id: 'image', label: 'Image Upload', icon: FileImage },
                { id: 'url', label: 'URL Analysis', icon: LinkIcon },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto">
            {(activeTab === 'video' || activeTab === 'image') && (
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your {activeTab} file here
                  </h3>
                  <p className="text-gray-400 mb-6">
                    or click to browse from your device
                  </p>
                  <input
                    type="file"
                    accept={activeTab === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Select File
                  </label>
                  {file && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 w-full">
                      <p className="text-white truncate">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Enter URL</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    onClick={handleAnalyze}
                  >
                    Analyze URL
                  </button>
                </div>
              </div>
            )}

            {/* Start Analysis Button */}
            <button
              className={`w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 ${
                isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </button>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
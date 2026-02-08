'use client';

import { useState } from 'react';
import { Upload, FileVideo, FileImage, Link as LinkIcon, Shield, Eye, Activity, Heart, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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
  const [sensitiveContentStatus, setSensitiveContentStatus] = useState<'checking' | 'pass' | 'warn' | 'block'>('checking');

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
    if ((activeTab !== 'url' && !file) || (activeTab === 'url' && !url.trim())) {
      alert('Please provide a file or URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // Perform the analysis
      const result = await analysisService.analyzeMedia({
        file: activeTab !== 'url' ? file : undefined,
        url: activeTab === 'url' ? url : undefined,
        type: activeTab
      });

      // Clear progress interval
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Navigate to results page
      setTimeout(() => {
        router.push(`/results/${result.sessionId}`);
      }, 500);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      alert('Analysis failed. Please try again.');
    }
  };

  // Simulate sensitive content check
  useState(() => {
    if (sensitiveContentStatus === 'checking') {
      const timer = setTimeout(() => {
        setSensitiveContentStatus('pass'); // Simulate passing check
      }, 1500);
      return () => clearTimeout(timer);
    }
  });

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Deepfake <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Analyzer</span>
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
              ].map((tab) => (
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
            {activeTab === 'video' || activeTab === 'image' ? (
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
                      <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
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
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    onClick={() => {
                      if (url.trim()) {
                        handleAnalyze();
                      }
                    }}
                  >
                    Analyze URL
                  </button>
                </div>
              </div>
            )}

            {/* Sensitive Content Pre-Scan */}
            <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Sensitive Content Pre-Scan</h3>
                    <p className="text-gray-400 text-sm">Checking for inappropriate content</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {sensitiveContentStatus === 'checking' && (
                    <>
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-amber-400 font-medium">Checking...</span>
                    </>
                  )}
                  {sensitiveContentStatus === 'pass' && (
                    <>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-400 font-medium">Pass</span>
                    </>
                  )}
                  {sensitiveContentStatus === 'warn' && (
                    <>
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-400 font-medium">Warning</span>
                    </>
                  )}
                  {sensitiveContentStatus === 'block' && (
                    <>
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-rose-400 font-medium">Blocked</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Analysis in Progress</h3>
                  <span className="text-cyan-400 font-medium">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className={`w-3 h-3 mr-1 ${analysisProgress > 10 ? 'text-cyan-400' : 'text-gray-600'}`} />
                    <span>Extracting</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className={`w-3 h-3 mr-1 ${analysisProgress > 30 ? 'text-cyan-400' : 'text-gray-600'}`} />
                    <span>Face Landmarks</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className={`w-3 h-3 mr-1 ${analysisProgress > 60 ? 'text-cyan-400' : 'text-gray-600'}`} />
                    <span>Bio Signals</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className={`w-3 h-3 mr-1 ${analysisProgress > 80 ? 'text-cyan-400' : 'text-gray-600'}`} />
                    <span>Finalizing</span>
                  </div>
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
              {isAnalyzing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Start Analysis</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Bio Signals Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Eye Blink Analysis', icon: Eye, value: 'Normal', color: 'cyan' },
                { title: 'Micro-Expressions', icon: Activity, value: 'Stable', color: 'blue' },
                { title: 'Heart Rate (rPPG)', icon: Heart, value: '72 BPM', color: 'rose' },
              ].map((signal, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-${signal.color}-500/20 rounded-xl flex items-center justify-center`}>
                      <signal.icon className={`w-6 h-6 text-${signal.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-white">{signal.title}</h3>
                  </div>
                  <div className="text-2xl font-bold text-white">{signal.value}</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                    <div
                      className={`bg-gradient-to-r from-${signal.color}-500 to-${signal.color}-400 h-2 rounded-full`}
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
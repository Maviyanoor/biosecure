'use client';

import { useState } from 'react';
import { Shield, Eye, Activity, Heart, Download, AlertTriangle, CheckCircle, Clock, BarChart3, FileText, Zap } from 'lucide-react';
import ClientWrapper from '@/components/ui/ClientWrapper';
import HeatmapViewer from '@/components/ui/HeatmapViewer';

// Mock data for results
const mockResults = {
  sessionId: 'sess_001',
  fileName: 'meeting_recording.mp4',
  fileType: 'Video',
  analysisDate: '2026-02-08',
  verdict: 'Real',
  confidence: 94.2,
  severity: 1.2,
  deepfakeType: 'None detected',
  bioSignals: {
    eyeBlink: { status: 'Normal', rate: 18, confidence: 96.5 },
    microExpressions: { status: 'Stable', confidence: 92.3 },
    rppg: { status: 'Normal', bpm: 72, confidence: 89.7 },
  },
  explainability: [
    'Natural eye blink patterns detected throughout the video',
    'Consistent micro-expressions matching facial movements',
    'Biological heart rate patterns present via rPPG analysis',
    'No inconsistencies found in facial landmark tracking',
  ],
  suspiciousFrames: [
    { timestamp: '00:12', score: 1.2, description: 'Minor lighting variation' },
    { timestamp: '00:45', score: 0.8, description: 'Natural head movement' },
  ],
  deepfakeTypes: {
    faceSwap: 5.2,
    lipSync: 3.1,
    expressionManipulation: 2.8,
    temporalInconsistency: 4.0,
  },
};

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const getStatusColor = (verdict: string) => {
    switch (verdict) {
      case 'Real':
        return 'from-emerald-500 to-teal-400';
      case 'Fake':
        return 'from-rose-500 to-pink-400';
      case 'Suspicious':
        return 'from-amber-500 to-orange-400';
      default:
        return 'from-gray-500 to-slate-400';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity < 3) return 'text-emerald-400';
    if (severity < 7) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Results</span>
            </h1>
            <p className="text-xl text-gray-300">Session ID: {mockResults.sessionId}</p>
          </div>

          {/* Verdict Card */}
          <div className={`bg-gradient-to-br ${getStatusColor(mockResults.verdict)} rounded-3xl p-8 mb-12 text-white shadow-2xl`}>
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {mockResults.verdict === 'Real' ? (
                    <CheckCircle className="w-12 h-12" />
                  ) : mockResults.verdict === 'Fake' ? (
                    <AlertTriangle className="w-12 h-12" />
                  ) : (
                    <AlertTriangle className="w-12 h-12" />
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">{mockResults.verdict}</h2>
                  <p className="text-xl opacity-90">Confidence: {mockResults.confidence}%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-1">Severity Score</div>
                <div className={`text-5xl font-bold ${getSeverityColor(mockResults.severity)}`}>
                  {mockResults.severity.toFixed(1)}/10
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Bio Signals */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Signal Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Eye Blink Panel */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white">Eye Blink</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.eyeBlink.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rate</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.eyeBlink.rate}/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.eyeBlink.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Micro-Expressions Panel */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white">Micro-Exp</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.microExpressions.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.microExpressions.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* rPPG Panel */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-400" />
                    </div>
                    <h3 className="font-semibold text-white">rPPG</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.rppg.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">BPM</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.rppg.bpm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-white font-medium">{mockResults.bioSignals.rppg.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainability Section */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Why This Result?</h3>
                </div>
                <div className="space-y-4">
                  {mockResults.explainability.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deepfake Type Classification */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Deepfake Type Analysis</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(mockResults.deepfakeTypes).map(([type, score]) => (
                    <div key={type} className="bg-slate-700/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400 capitalize mb-2">
                        {type.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-lg font-bold text-white">{score.toFixed(1)}</div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-400 h-2 rounded-full"
                          style={{ width: `${score * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Actions and Info */}
            <div className="space-y-8">
              {/* File Info */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">File Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">File Name</span>
                    <span className="text-white truncate max-w-[120px]">{mockResults.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">File Type</span>
                    <span className="text-white">{mockResults.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Analysis Date</span>
                    <span className="text-white">{mockResults.analysisDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deepfake Type</span>
                    <span className="text-white">{mockResults.deepfakeType}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    onClick={() => {
                      // Generate PDF report using mock data
                      import('@/lib/pdfService').then(module => {
                        module.generatePDFReport(mockResults);
                      });
                    }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF Report</span>
                  </button>
                  <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>View Detailed Report</span>
                  </button>
                  <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Re-analyze</span>
                  </button>
                </div>
              </div>

              {/* Heatmap Toggle */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Visualization</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Show Heatmap</span>
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showHeatmap ? 'bg-cyan-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showHeatmap ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Overlay heatmap showing areas of highest anomaly detection
                </p>
              </div>
            </div>
          </div>

          {/* Heatmap Viewer */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Frame-by-Frame Analysis</h3>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">Timeline</span>
              </div>
            </div>

            {/* Heatmap Viewer Component */}
            <div className="mb-8">
              <HeatmapViewer
                frames={[
                  { id: 'frame-1', timestamp: '00:05', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                  { id: 'frame-2', timestamp: '00:12', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                  { id: 'frame-3', timestamp: '00:18', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                  { id: 'frame-4', timestamp: '00:25', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                  { id: 'frame-5', timestamp: '00:32', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                  { id: 'frame-6', timestamp: '00:40', imageUrl: '/placeholder-frame.jpg', heatmapUrl: '/placeholder-heatmap.jpg' },
                ]}
                showHeatmap={showHeatmap}
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>00:00</span>
                <span>00:30</span>
                <span>01:00</span>
                <span>01:30</span>
                <span>02:00</span>
              </div>

              <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                {/* Mock timeline with suspicious markers */}
                <div className="absolute top-0 left-0 w-full h-full flex">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 ${
                        i % 7 === 0 ? 'bg-rose-500/30' : i % 5 === 0 ? 'bg-amber-500/20' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Suspicious markers */}
                <div className="absolute top-0 h-full w-1 bg-rose-500" style={{ left: '15%' }}></div>
                <div className="absolute top-0 h-full w-1 bg-amber-500" style={{ left: '45%' }}></div>
                <div className="absolute top-0 h-full w-1 bg-rose-500" style={{ left: '75%' }}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockResults.suspiciousFrames.map((frame, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedFrame === index
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedFrame(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{frame.timestamp}</span>
                      <span className={`text-sm font-bold ${
                        frame.score > 5 ? 'text-rose-400' : frame.score > 2 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {frame.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{frame.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
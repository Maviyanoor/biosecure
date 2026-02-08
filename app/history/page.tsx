'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Users, FileText, RotateCcw, Trash2 } from 'lucide-react';
import ClientWrapper from '@/components/ui/ClientWrapper';
import { sessionHistoryService, SessionHistoryItem } from '@/lib/sessionHistoryService';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    realDetected: 0,
    fakeDetected: 0,
    avgConfidence: 0
  });

  useEffect(() => {
    // Load sessions from localStorage
    const loadedSessions = sessionHistoryService.getAllSessions();
    setSessions(loadedSessions);

    // Calculate stats
    const stats = sessionHistoryService.getStats();
    setStats(stats);
  }, []);

  const getStatusColor = (verdict: string) => {
    switch (verdict) {
      case 'Real':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Fake':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Suspicious':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all session history? This cannot be undone.')) {
      sessionHistoryService.clearHistory();
      setSessions([]);
      setStats({
        totalAnalyses: 0,
        realDetected: 0,
        fakeDetected: 0,
        avgConfidence: 0
      });
    }
  };

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">History</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Review your past deepfake analysis sessions
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Total Analyses', value: stats.totalAnalyses.toString(), icon: FileText, color: 'blue' },
              { title: 'Real Detected', value: stats.realDetected.toString(), icon: Shield, color: 'emerald' },
              { title: 'Fake Detected', value: stats.fakeDetected.toString(), icon: Shield, color: 'rose' },
              { title: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: TrendingUp, color: 'cyan' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sessions List */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
              <button
                onClick={clearHistory}
                className="flex items-center space-x-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No analysis history</h3>
                <p className="text-slate-400">Your analysis sessions will appear here after you run an analysis</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {sessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-slate-700/20 transition-colors duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-white">{session.fileName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.verdict)}`}>
                            {session.verdict}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>Date: {session.date}</span>
                          <span>Type: {session.inputType}</span>
                          <span>Confidence: {session.confidence}%</span>
                          <span>Severity: {session.severity}/10</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                          onClick={() => window.location.href = `/results/${session.id}`}
                        >
                          View Report
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
// Session History Service using localStorage
import { AnalysisResult } from './analysisService';

const SESSION_HISTORY_KEY = 'biosecure_session_history';

export interface SessionHistoryItem {
  id: string;
  date: string;
  inputType: string;
  verdict: string;
  confidence: number;
  severity: number;
  fileName: string;
  analysisResult?: AnalysisResult; // Store full result for detailed view
}

export const sessionHistoryService = {
  // Get all session history from localStorage
  getAllSessions(): SessionHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(SESSION_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading session history:', error);
      return [];
    }
  },

  // Add a new session to history
  addSession(result: AnalysisResult): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = sessionHistoryService.getAllSessions();
      const newSession: SessionHistoryItem = {
        id: result.sessionId,
        date: result.analysisDate,
        inputType: result.fileType,
        verdict: result.verdict,
        confidence: result.confidence,
        severity: result.severity,
        fileName: result.fileName,
        analysisResult: result
      };
      
      // Add to beginning of array (most recent first)
      const updatedSessions = [newSession, ...sessions];
      
      // Limit to 50 most recent sessions
      const limitedSessions = updatedSessions.slice(0, 50);
      
      localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Error saving session to history:', error);
    }
  },

  // Get a specific session by ID
  getSessionById(id: string): SessionHistoryItem | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      const sessions = sessionHistoryService.getAllSessions();
      return sessions.find(session => session.id === id);
    } catch (error) {
      console.error('Error getting session by ID:', error);
      return undefined;
    }
  },

  // Clear all session history
  clearHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(SESSION_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing session history:', error);
    }
  },

  // Get statistics from session history
  getStats() {
    const sessions = sessionHistoryService.getAllSessions();
    
    if (sessions.length === 0) {
      return {
        totalAnalyses: 0,
        fakeDetected: 0,
        realDetected: 0,
        avgConfidence: 0,
        avgSeverity: 0
      };
    }
    
    const totalAnalyses = sessions.length;
    const fakeDetected = sessions.filter(s => s.verdict === 'Fake').length;
    const realDetected = sessions.filter(s => s.verdict === 'Real').length;
    const avgConfidence = sessions.reduce((sum, s) => sum + s.confidence, 0) / totalAnalyses;
    const avgSeverity = sessions.reduce((sum, s) => sum + s.severity, 0) / totalAnalyses;
    
    return {
      totalAnalyses,
      fakeDetected,
      realDetected,
      avgConfidence: parseFloat(avgConfidence.toFixed(2)),
      avgSeverity: parseFloat(avgSeverity.toFixed(2))
    };
  }
};
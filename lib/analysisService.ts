// Mock API Service for BioSecure Analysis
// This simulates backend API calls with realistic response times and data

export interface AnalysisRequest {
  file?: File;
  url?: string;
  type: 'video' | 'image' | 'url';
}

export interface AnalysisResult {
  sessionId: string;
  fileName: string;
  fileType: string;
  analysisDate: string;
  verdict: 'Real' | 'Fake' | 'Suspicious';
  confidence: number;
  severity: number;
  deepfakeType: string;
  bioSignals: {
    eyeBlink: {
      status: string;
      rate: number;
      confidence: number;
    };
    microExpressions: {
      status: string;
      confidence: number;
    };
    rppg: {
      status: string;
      bpm: number;
      confidence: number;
    };
  };
  explainability: string[];
  suspiciousFrames: Array<{
    timestamp: string;
    score: number;
    description: string;
  }>;
  deepfakeTypes: {
    faceSwap: number;
    lipSync: number;
    expressionManipulation: number;
    temporalInconsistency: number;
  };
}

export interface Session {
  id: string;
  date: string;
  inputType: string;
  verdict: string;
  confidence: number;
  severity: number;
  fileName: string;
}

// Mock data for different analysis scenarios
const MOCK_RESULTS: Record<string, AnalysisResult> = {
  'real': {
    sessionId: `sess_${Date.now()}`,
    fileName: 'meeting_recording.mp4',
    fileType: 'Video',
    analysisDate: new Date().toISOString().split('T')[0],
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
      faceSwap: 2.1,
      lipSync: 1.8,
      expressionManipulation: 3.2,
      temporalInconsistency: 2.5,
    },
  },
  'fake': {
    sessionId: `sess_${Date.now()}`,
    fileName: 'profile_photo.jpg',
    fileType: 'Image',
    analysisDate: new Date().toISOString().split('T')[0],
    verdict: 'Fake',
    confidence: 87.5,
    severity: 8.7,
    deepfakeType: 'Face Swap',
    bioSignals: {
      eyeBlink: { status: 'Abnormal', rate: 0, confidence: 94.2 },
      microExpressions: { status: 'Inconsistent', confidence: 78.3 },
      rppg: { status: 'Absent', bpm: 0, confidence: 91.5 },
    },
    explainability: [
      'No natural eye blink patterns detected',
      'Micro-expressions inconsistent with facial structure',
      'No biological heart rate patterns detected',
      'Facial landmarks show signs of manipulation',
    ],
    suspiciousFrames: [
      { timestamp: '00:05', score: 8.7, description: 'Significant facial distortion' },
      { timestamp: '00:18', score: 7.2, description: 'Inconsistent lighting' },
    ],
    deepfakeTypes: {
      faceSwap: 8.7,
      lipSync: 3.1,
      expressionManipulation: 6.8,
      temporalInconsistency: 5.0,
    },
  },
  'suspicious': {
    sessionId: `sess_${Date.now()}`,
    fileName: 'interview_video.mp4',
    fileType: 'Video',
    analysisDate: new Date().toISOString().split('T')[0],
    verdict: 'Suspicious',
    confidence: 62.3,
    severity: 4.5,
    deepfakeType: 'Expression Manipulation',
    bioSignals: {
      eyeBlink: { status: 'Irregular', rate: 12, confidence: 78.5 },
      microExpressions: { status: 'Unstable', confidence: 65.3 },
      rppg: { status: 'Weak', bpm: 68, confidence: 72.7 },
    },
    explainability: [
      'Some irregularities in eye blink patterns',
      'Micro-expressions show minor inconsistencies',
      'Weak but present biological heart rate patterns',
      'Possible signs of facial manipulation',
    ],
    suspiciousFrames: [
      { timestamp: '00:22', score: 4.5, description: 'Facial landmark anomaly' },
      { timestamp: '00:55', score: 3.8, description: 'Lighting inconsistency' },
    ],
    deepfakeTypes: {
      faceSwap: 4.2,
      lipSync: 5.1,
      expressionManipulation: 7.8,
      temporalInconsistency: 4.0,
    },
  }
};

// Simulate API delay
const simulateDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock analysis service
import { sessionHistoryService } from './sessionHistoryService';

export const analysisService = {
  async analyzeMedia(request: AnalysisRequest): Promise<AnalysisResult> {
    // Simulate processing time
    await simulateDelay(2000, 4000);

    // Determine result type based on filename or random chance
    let resultType: keyof typeof MOCK_RESULTS = 'real';

    if (request.file) {
      const fileName = request.file.name.toLowerCase();
      if (fileName.includes('fake') || fileName.includes('deep')) {
        resultType = Math.random() > 0.3 ? 'fake' : 'suspicious';
      } else if (fileName.includes('susp')) {
        resultType = 'suspicious';
      }
    } else if (request.url) {
      if (request.url.includes('fake') || request.url.includes('deep')) {
        resultType = Math.random() > 0.3 ? 'fake' : 'suspicious';
      }
    }

    const result = MOCK_RESULTS[resultType];

    // Save to session history
    sessionHistoryService.addSession(result);

    return result;
  },

  async getSessionHistory(): Promise<Session[]> {
    // Simulate API delay
    await simulateDelay(500, 1000);

    // Return mock session history
    return [
      {
        id: 'sess_001',
        date: '2026-02-08',
        inputType: 'Video',
        verdict: 'Real',
        confidence: 94.2,
        severity: 1.2,
        fileName: 'meeting_recording.mp4',
      },
      {
        id: 'sess_002',
        date: '2026-02-07',
        inputType: 'Image',
        verdict: 'Fake',
        confidence: 87.5,
        severity: 8.7,
        fileName: 'profile_photo.jpg',
      },
      {
        id: 'sess_003',
        date: '2026-02-06',
        inputType: 'Video',
        verdict: 'Suspicious',
        confidence: 62.3,
        severity: 4.5,
        fileName: 'interview_video.mp4',
      },
      {
        id: 'sess_004',
        date: '2026-02-05',
        inputType: 'URL',
        verdict: 'Real',
        confidence: 98.1,
        severity: 0.8,
        fileName: 'youtube_video',
      },
    ];
  },

  async getGlobalStats() {
    // Simulate API delay
    await simulateDelay(500, 1000);

    return {
      totalAnalyses: 1247,
      fakeDetected: 156,
      realDetected: 1042,
      avgConfidence: 87.4,
      verdictDistribution: [
        { name: 'Real', value: 83.6, color: 'bg-emerald-500' },
        { name: 'Fake', value: 12.5, color: 'bg-rose-500' },
        { name: 'Suspicious', value: 3.9, color: 'bg-amber-500' },
      ],
      monthlyTrends: [
        { month: 'Jan', analyses: 120, fake: 15 },
        { month: 'Feb', analyses: 180, fake: 22 },
        { month: 'Mar', analyses: 210, fake: 28 },
        { month: 'Apr', analyses: 195, fake: 25 },
        { month: 'May', analyses: 230, fake: 30 },
        { month: 'Jun', analyses: 260, fake: 35 },
      ],
      bioSignals: [
        { name: 'Eye Blink', accuracy: 94.2, detections: 1120 },
        { name: 'Micro-Exp', accuracy: 89.7, detections: 1080 },
        { name: 'rPPG', accuracy: 85.3, detections: 950 },
        { name: 'Facial Patterns', accuracy: 91.5, detections: 1020 },
      ],
    };
  },

  async getChatResponse(message: string): Promise<string> {
    // Simulate API delay
    await simulateDelay(500, 1000);

    // Simple keyword-based responses
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('rppg') || lowerMsg.includes('heart')) {
      return "Remote Photoplethysmography (rPPG) detects blood volume changes in the face using light reflection. Real humans have consistent heart rate patterns, while deepfakes often lack these biological signals.";
    } else if (lowerMsg.includes('blink') || lowerMsg.includes('eye')) {
      return "Natural eye blinking follows specific patterns and rates. Deepfakes often struggle to replicate realistic blink timing, frequency, and lid closure patterns.";
    } else if (lowerMsg.includes('confidence') || lowerMsg.includes('accuracy')) {
      return "Confidence scores represent how certain our algorithm is about the detection. Scores above 90% are highly reliable, while scores between 60-90% indicate suspicious content requiring manual review.";
    } else if (lowerMsg.includes('severity')) {
      return "The severity score indicates the level of deepfake characteristics detected, ranging from 0-10. Higher scores suggest stronger evidence of manipulation.";
    } else if (lowerMsg.includes('how') && lowerMsg.includes('work')) {
      return "BioSecure analyzes multiple biological signals: eye blink patterns, micro-expressions, and heart rate via rPPG. Each signal is processed independently and combined for the final verdict.";
    } else if (lowerMsg.includes('fake') || lowerMsg.includes('deepfake')) {
      return "A deepfake is synthetic media where a person's likeness is replaced with someone else's. Our system detects inconsistencies in biological signals that are hard to replicate in synthetic media.";
    } else {
      return "I'm your BioSecure AI assistant. Ask me about our detection methods, biological signals, or analysis results. I can explain how we detect deepfakes using eye blinks, micro-expressions, and heart rate patterns.";
    }
  }
};
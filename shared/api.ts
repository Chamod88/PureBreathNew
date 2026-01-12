/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Authentication types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  age?: number;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface User {
  id: string;
  email: string;
  age?: number;
}

/**
 * Audio Analysis types
 */
export interface AudioAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  prediction: 'healthy' | 'copd' | 'pneumonia';
  confidence: number;
  uploadedAt: string;
  processedAt: string;
  processingTime?: number;
}

export interface AudioAnalysisHistory {
  analyses: AudioAnalysis[];
  total: number;
  hasMore: boolean;
}

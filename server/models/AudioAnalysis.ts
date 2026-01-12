import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioAnalysis extends Document {
  userId: string;
  fileName: string;
  fileSize: number;
  duration?: number; // in seconds
  mimeType: string;
  prediction: 'healthy' | 'copd' | 'pneumonia';
  confidence: number;
  uploadedAt: Date;
  processedAt: Date;
  processingTime?: number; // in milliseconds
  modelVersion?: string;
}

const AudioAnalysisSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true, // in bytes
  },
  duration: {
    type: Number,
    required: false, // in seconds
  },
  mimeType: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    enum: ['healthy', 'copd', 'pneumonia'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
  processingTime: {
    type: Number,
    required: false, // in milliseconds
  },
  modelVersion: {
    type: String,
    default: '1.0.0',
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
AudioAnalysisSchema.index({ userId: 1, uploadedAt: -1 });
AudioAnalysisSchema.index({ userId: 1, prediction: 1 });

export const AudioAnalysis = mongoose.model<IAudioAnalysis>('AudioAnalysis', AudioAnalysisSchema);
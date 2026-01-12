import { RequestHandler } from "express";
import { AudioAnalysis } from "../models/AudioAnalysis";
import mongoose from "mongoose";

// In-memory storage for development when DB is not available
let inMemoryAnalyses: any[] = [];

export interface SaveAnalysisRequest {
  userId: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  mimeType: string;
  prediction: 'healthy' | 'copd' | 'pneumonia';
  confidence: number;
  processingTime?: number;
  modelVersion?: string;
}

export const saveAnalysis: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      fileName,
      fileSize,
      duration,
      mimeType,
      prediction,
      confidence,
      processingTime,
      modelVersion
    }: SaveAnalysisRequest = req.body;

    // Validate required fields
    if (!userId || !fileName || !fileSize || !mimeType || !prediction || confidence === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (mongoose.connection.readyState === 1) {
      // DB connected, use MongoDB
      const analysis = new AudioAnalysis({
        userId,
        fileName,
        fileSize,
        duration,
        mimeType,
        prediction,
        confidence,
        processingTime,
        modelVersion,
        uploadedAt: new Date(),
        processedAt: new Date(),
      });

      await analysis.save();

      res.status(201).json({
        message: "Analysis saved successfully",
        analysisId: analysis._id,
      });
    } else {
      // Use in-memory storage
      const analysis = {
        _id: Date.now().toString(),
        userId,
        fileName,
        fileSize,
        duration,
        mimeType,
        prediction,
        confidence,
        processingTime,
        modelVersion,
        uploadedAt: new Date(),
        processedAt: new Date(),
      };
      inMemoryAnalyses.push(analysis);

      res.status(201).json({
        message: "Analysis saved successfully (in-memory)",
        analysisId: analysis._id,
      });
    }
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (mongoose.connection.readyState === 1) {
      // DB connected, use MongoDB
      const analyses = await AudioAnalysis.find({ userId })
        .sort({ uploadedAt: -1 })
        .limit(parseInt(limit as string))
        .skip(parseInt(skip as string));

      const total = await AudioAnalysis.countDocuments({ userId });

      res.status(200).json({
        analyses: analyses.map(analysis => ({
          id: analysis._id,
          fileName: analysis.fileName,
          fileSize: analysis.fileSize,
          duration: analysis.duration,
          prediction: analysis.prediction,
          confidence: analysis.confidence,
          uploadedAt: analysis.uploadedAt,
          processedAt: analysis.processedAt,
          processingTime: analysis.processingTime,
        })),
        total,
        hasMore: total > parseInt(skip as string) + analyses.length,
      });
    } else {
      // Use in-memory storage
      const userAnalyses = inMemoryAnalyses.filter(a => a.userId === userId)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(parseInt(skip as string), parseInt(skip as string) + parseInt(limit as string));

      const total = inMemoryAnalyses.filter(a => a.userId === userId).length;

      res.status(200).json({
        analyses: userAnalyses.map(analysis => ({
          id: analysis._id,
          fileName: analysis.fileName,
          fileSize: analysis.fileSize,
          duration: analysis.duration,
          prediction: analysis.prediction,
          confidence: analysis.confidence,
          uploadedAt: analysis.uploadedAt,
          processedAt: analysis.processedAt,
          processingTime: analysis.processingTime,
        })),
        total,
        hasMore: total > parseInt(skip as string) + userAnalyses.length,
      });
    }
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
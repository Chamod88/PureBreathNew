import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  password?: string; // Optional for Google users
  provider: 'local' | 'google';
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google OAuth users
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  age: {
    type: Number,
    required: false,
    min: 1,
    max: 120,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);
import { RequestHandler } from "express";
import { LoginRequest, SignupRequest, AuthResponse, GoogleLoginRequest } from "@shared/api";
import { User } from "../models/User";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    const user = await User.findOne({ email, password, provider: 'local' });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = `mock-token-${user.id}`;
    const response: AuthResponse = {
      token,
      user: { id: user.id, email: user.email, age: user.age }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword, age }: SignupRequest = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      id: Date.now().toString(),
      email,
      password, // In production, hash the password
      provider: 'local',
      age,
    });

    await newUser.save();

    const token = `mock-token-${newUser.id}`;
    const response: AuthResponse = {
      token,
      user: { id: newUser.id, email: newUser.email, age: newUser.age }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGoogleLogin: RequestHandler = async (req, res) => {
  try {
    const { credential }: GoogleLoginRequest = req.body;

    // In a real app, verify the credential with Google
    // For mock, we'll create a user based on credential hash
    const mockEmail = `google-${credential.slice(0, 10)}@example.com`; // Simplified

    let user = await User.findOne({ email: mockEmail });
    if (!user) {
      user = new User({
        id: Date.now().toString(),
        email: mockEmail,
        provider: 'google',
      });
      await user.save();
    }

    const token = `mock-token-${user.id}`;
    const response: AuthResponse = {
      token,
      user: { id: user.id, email: user.email, age: user.age }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, UserRole, JWTPayload } from '../types';
import { sendEmail } from '../services/emailService';

/**
 * Generate JWT tokens for user
 */
const generateTokens = (userId: string, email: string, role: UserRole) => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;

  const payload = { userId, email, role };
  
  const accessToken = jwt.sign(payload, accessTokenSecret, { 
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' 
  } as any);
  
  const refreshToken = jwt.sign(payload, refreshTokenSecret, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' 
  } as any);

  return { accessToken, refreshToken };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400);
  }

  const { firstName, lastName, email, password, role = UserRole.STUDENT } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    role
  });

  // Generate email verification token
  const verificationToken = user.generatePasswordResetToken();
  
  await user.save();

  // Send verification email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Test School',
      template: 'emailVerification',
      data: {
        name: user.fullName,
        email: user.email,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
      }
    });
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

  const response: ApiResponse = {
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        currentLevel: user.currentLevel
      },
      accessToken,
      refreshToken
    }
  };

  res.status(201).json(response);
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed: ' + errors.array().map(err => err.msg).join(', '), 400);
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

  const response: ApiResponse = {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        currentLevel: user.currentLevel,
        canTakeTest: user.canTakeTest
      },
      accessToken,
      refreshToken
    }
  };

  res.status(200).json(response);
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
    const decoded = jwt.verify(token, refreshTokenSecret) as JWTPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, we'll just send a success response
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };

  res.status(200).json(response);
};

/**
 * @desc    Verify email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    // Add expiry check if needed
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Email verified successfully'
  };

  res.status(200).json(response);
};

/**
 * @desc    Resend email verification
 * @route   POST /api/auth/resend-verification
 * @access  Private
 */
export const resendEmailVerification = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  const verificationToken = user.generatePasswordResetToken();
  await user.save();

  // Send verification email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Test School',
      template: 'emailVerification',
      data: {
        name: user.fullName,
        email: user.email,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
      }
    });
  } catch (emailError) {
    throw new AppError('Failed to send verification email', 500);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Verification email sent successfully'
  };

  res.status(200).json(response);
};

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    const response: ApiResponse = {
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    };
    res.status(200).json(response);
    return;
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // Send password reset email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Test School',
      template: 'passwordReset',
      data: {
        name: user.fullName,
        email: user.email,
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      }
    });
  } catch (emailError) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new AppError('Failed to send password reset email', 500);
  }

  const response: ApiResponse = {
    success: true,
    message: 'If an account with that email exists, we have sent a password reset link.'
  };

  res.status(200).json(response);
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Password reset successfully'
  };

  res.status(200).json(response);
};

/**
 * @desc    Send OTP to user email
 * @route   POST /api/auth/send-otp
 * @access  Private
 */
export const sendOTP = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const otp = user.generateOTP();
  await user.save();

  // Send OTP email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Your OTP Code - Test School',
      template: 'otpCode',
      data: {
        name: user.fullName,
        email: user.email,
        otpCode: otp
      }
    });
  } catch (emailError) {
    throw new AppError('Failed to send OTP email', 500);
  }

  const response: ApiResponse = {
    success: true,
    message: 'OTP sent successfully to your email'
  };

  res.status(200).json(response);
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Private
 */
export const verifyOTP = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const { otp } = req.body;

  const user = await User.findOne({
    _id: req.user?.userId,
    otpCode: otp,
    otpExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'OTP verified successfully'
  };

  res.status(200).json(response);
};

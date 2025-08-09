import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import TestSession from '../models/TestSession';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, UserRole, AuthRequest } from '../types';

/**
 * Get current user profile
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to retrieve profile', 500);
  }
};

/**
 * Update current user profile
 */
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation error', 400);
    }

    const userId = req.user?.userId;
    const {
      firstName,
      lastName,
      phone,
      organization,
      position,
      country,
      city
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (organization) user.organization = organization;
    if (position) user.position = position;
    if (country) user.country = country;
    if (city) user.city = city;

    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to update profile', 500);
  }
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    const response: ApiResponse = {
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to retrieve users', 500);
  }
};

/**
 * Get user by ID (Admin/Supervisor only)
 */
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation error', 400);
    }

    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to retrieve user', 500);
  }
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation error', 400);
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = role;
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'User role updated successfully',
      data: { user }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to update user role', 500);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation error', 400);
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow deleting admin users
    if (user.role === UserRole.ADMIN) {
      throw new AppError('Cannot delete admin users', 403);
    }

    await User.findByIdAndDelete(userId);

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to delete user', 500);
  }
};

/**
 * Get user test history
 */
export const getUserTestHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user?.userId;
    const requestingUserRole = req.user?.role;

    // Users can only view their own history unless they're admin/supervisor
    if (userId !== requestingUserId && 
        requestingUserRole !== UserRole.ADMIN && 
        requestingUserRole !== UserRole.SUPERVISOR) {
      throw new AppError('Access denied', 403);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const testSessions = await TestSession.find({ userId })
      .sort({ createdAt: -1 })
      .populate('questionIds', 'title level competencyArea');

    const response: ApiResponse = {
      success: true,
      message: 'Test history retrieved successfully',
      data: { 
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          currentLevel: user.currentLevel
        },
        testSessions 
      }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Failed to retrieve test history', 500);
  }
};

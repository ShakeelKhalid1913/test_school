import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { JWTPayload, UserRole } from '../types';
import User from '../models/User';

/**
 * Interface for authenticated request
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts user information from valid JWT and adds to request object
 */
export const authMiddleware = async (
  req: Request & { user?: { userId: string; email: string; role: UserRole } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No valid token provided.', 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError('Access denied. No valid token provided.', 401);
    }

    // Verify token
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // Check if user email is verified (except for resending verification)
    if (!user.isEmailVerified && !req.path.includes('resend-verification')) {
      throw new AppError('Please verify your email before accessing this resource', 401);
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check if user has admin role
 */
export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError('Access denied. Admin role required.', 403);
  }

  next();
};

/**
 * Middleware to check if user has supervisor or admin role
 */
export const supervisorOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== UserRole.SUPERVISOR && req.user.role !== UserRole.ADMIN) {
    throw new AppError('Access denied. Supervisor or Admin role required.', 403);
  }

  next();
};

/**
 * Middleware to check specific roles
 */
export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403);
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is provided, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        const jwtSecret = process.env.JWT_ACCESS_SECRET;
        if (jwtSecret) {
          const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
          const user = await User.findById(decoded.userId).select('-password');
          
          if (user) {
            req.user = {
              userId: decoded.userId,
              email: decoded.email,
              role: decoded.role
            };
          }
        }
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};

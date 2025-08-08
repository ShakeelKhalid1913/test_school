import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err as AppError;

  // Log error for debugging
  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Default error values
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Handle specific mongoose errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + Object.values((err as any).errors).map((val: any) => val.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if ((err as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err as any).keyValue)[0];
    message = `${field} already exists`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Prepare response
  const response: ApiResponse = {
    success: false,
    message,
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = error.stack;
  }

  // Send error response
  res.status(statusCode).json(response);
};

/**
 * Async error wrapper to catch async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

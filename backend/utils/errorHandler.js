/**
 * Centralized error handling utility
 * All errors should be caught and passed through this handler
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered for ${Object.keys(err.keyValue)}`;
    return res.status(400).json({
      success: false,
      message,
      error: {
        code: 'DUPLICATE_FIELD',
        field: Object.keys(err.keyValue)[0],
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: {
        code: 'INVALID_TOKEN',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: {
        code: 'TOKEN_EXPIRED',
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: {
        code: 'VALIDATION_ERROR',
        details: messages,
      },
    });
  }

  // Standard error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: {
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};

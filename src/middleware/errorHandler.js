// Centralized Error Handling Middleware

/**
 * Custom Error Class สำหรับสร้าง error ที่มี statusCode
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // แยกระหว่าง operational error กับ programming error

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Handler Middleware
 * จัดการ error ทั้งหมดในระบบที่เดียว
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error สำหรับ debugging
  console.error("Error:", {
    message: err.message,
    statusCode: error.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // MongoDB Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new AppError(message, 400);
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 400);
  }

  // MongoDB Cast Error (Invalid ID)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // Supabase Error
  if (err.code && err.code.startsWith("PGRST")) {
    error.statusCode = 400;
  }

  // Response
  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message || "Server Error",
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err,
      }),
    },
  });
};

/**
 * 404 Not Found Handler
 * จัดการเมื่อไม่เจอ route ที่ request มา
 */
export const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

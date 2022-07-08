const AppError = require('./../utils/appError');

// Handling cast error for invalid DB IDs or other fields from mongoose
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handling duplicate DB field errors from mongoDB
const handleDuplicateFieldsDB = (err) => {
  // Extract the error field name and value
  const field = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field: ${field} with value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational trust error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // Log error
    console.error('ERROR', err);
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// Global Error Handler
module.exports = (err, req, res, next) => {
  console.log(err.stack);
  // Set a default error status code and error status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Creating a copy of the error object
    let error = Object.create(err);
    // Handling invalid DB field errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // Handling duplicate DB field errors
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};

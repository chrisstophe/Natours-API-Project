// Global Error Handler
module.exports = (err, req, res, next) => {
  console.log(err.stack);
  // Set a default error status code and error status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

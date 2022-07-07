const express = require('express');
const { fail } = require('assert');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Setting up a simple server with Express
const app = express();

///////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE STACK
// Only log when in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// Middleware to serve static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////////////////////////////////////////////////////////////////////////////
// ROUTES
// Mounted routers (also Middleware)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling unhandled routes
// If we reach this point, that means the other middleware didn't handle the request
// Always add these handlers at the end of the middleware stack
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

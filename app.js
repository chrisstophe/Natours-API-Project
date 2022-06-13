const express = require('express');
const { fail } = require('assert');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Setting up a simple server with Express
const app = express();

///////////////////////////////////////////////////////////////////////////////
// Middleware Stack
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('HELLO FROM THE MIDDLEWARE');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////////////////////////////////////////////////////////////////////////////
// ROUTES
// Mounted routers (also Middleware)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

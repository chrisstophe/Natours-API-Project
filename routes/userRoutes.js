const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

///////////////////////////////////////////////////////////////////
//Routes
const router = express.Router();

// User Authentication Routes
// Handling the signup route
router.post('/signup', authController.signup);
// Handling the login route
router.post('/login', authController.login);

// Handling GET and POST requests for users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Handling GET specific tour, PATCH, and DELETE requests for users
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

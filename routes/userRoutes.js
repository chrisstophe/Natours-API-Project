const express = require('express');
const userController = require('./../controllers/userController');

///////////////////////////////////////////////////////////////////
//Routes
const router = express.Router();

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

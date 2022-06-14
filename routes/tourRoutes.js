const express = require('express');
const tourController = require('./../controllers/tourController');
///////////////////////////////////////////////////////////////////
//Routes
const router = express.Router();

// Param Middleware
router.param('id', tourController.checkID);

// Handling GET and POST requests for tours
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

// Handling GET specific tour, PATCH, and DELETE requests for tours
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

const express = require('express');
const tourController = require('./../controllers/tourController');
///////////////////////////////////////////////////////////////////
//Routes
const router = express.Router();

// Param Middleware
// router.param('id', tourController.checkID);

// Adding an alias router for tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// Route for tour stats that calls an aggregation pipeline
router.route('/tour-stats').get(tourController.getTourStats);
// Route for monthly plan that calls the aggregation pipeline
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Handling GET and POST requests for tours
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// Handling GET specific tour, PATCH, and DELETE requests for tours
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

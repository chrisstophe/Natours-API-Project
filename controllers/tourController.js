const { listenerCount } = require('../app');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

///////////////////////////////////////////////////////////////////
// Route Handler functions aka Controllers

// Middleware to pre-fill the query object
// This middleweare is called from the popular top-5-cheap router
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  // Remember we always have to call next on middleware functions
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // ACTUALLY EXECUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    // Format the response using JSend
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // req.params will return an object with the parameters specified /:param
  const id = req.params.id;
  const tour = await Tour.findById(id);

  // Return the tour if found
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // An easier way of creating documents
  const newTour = await Tour.create(req.body);

  // Status 201 means created
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const tour = await Tour.findByIdAndUpdate(id, body, {
    // Setting new: true returns the modified document rather than the original
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  await Tour.findByIdAndDelete(id);
  // Status 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Aggregation pipeline to get tour stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // Set _id null to calculate for all tours
        _id: { $toUpper: '$difficulty' },
        // Add 1 for each doc going through the pipeline to count the number of tours
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // In the sorting stage, we use the fieldNames we defined in the grouping stage
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// Aggregation pipeline to calculate the busiest month of the year by calculating how many tours start in each month of a year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    // Selecting the dates in the input year
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // Grouping by month, counting the number of tours that start in that month, and adding their names to an array
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    // Add a month field
    {
      $addFields: { month: '$_id' },
    },
    // Remove the _id field
    {
      $project: {
        _id: 0,
      },
    },
    // Sort by number of tours starting in a month
    {
      $sort: { numTourStarts: -1 },
    },
    // Limit the number of documents output
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

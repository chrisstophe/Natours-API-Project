const { listenerCount } = require('../app');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

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

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // An easier way of creating documents
    const newTour = await Tour.create(req.body);

    // Status 201 means created
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
      errmsg: err.errmsg,
      // message: 'Invalid data sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      // Setting new: true returns the modified document rather than the original
      new: true,
      ranValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    await Tour.findByIdAndDelete(id);
    // Status 204 means no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Aggregation pipeline
exports.getTourStats = async (req, res) => {
  try {
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
      // At this stage, the _id is the $difficulty
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

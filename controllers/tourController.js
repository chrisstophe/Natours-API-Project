const { listenerCount } = require('../app');
const Tour = require('./../models/tourModel');

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
    // BUILD THE QUERY
    ////////////////////////////////
    // 1A) Filtering
    // Destructure then create a new object to create a copy of the query object
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove excluded fields from query object
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1B) Advanced Filtering
    // Using a RegExp to add a $ in front of gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Model.find( ) with nothing passed in will return all Tour documents found
    // Filtering by passing in an object
    let query = Tour.find(JSON.parse(queryStr));

    ////////////////////////////////
    // 2) Sorting
    // If a sort field was originally passed in, chain the .sort() method back onto the query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    // Adding a default sort field if none are specified
    else {
      query = query.sort('-createdAt');
    }

    ////////////////////////////////
    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    // Adding a default fields to return
    else {
      // Remove the __v field added by mongoose using a minus
      query = query.select('-__v');
    }

    ////////////////////////////////
    // 4) Pagination
    // Set a default page of 1
    const page = +req.query.page || 1;
    //Set a default limit of 100
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Throw an error if user requests a page that does not exist
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // ACTUALLY EXECUTE THE QUERY
    const tours = await query;

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

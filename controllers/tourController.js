const { listenerCount } = require('../app');
const Tour = require('./../models/tourModel');

///////////////////////////////////////////////////////////////////
// Route Handler functions aka Controllers
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD THE QUERY
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

    // 3) Sorting
    // If a sort field was originally passed in, chain the .sort() method back onto the query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    // Adding a default sort field if none are specified
    else {
      query = query.sort('-createdAt');
    }

    // ACTUALLY EXECUTE THE QUERY
    const tours = await query;

    // ALTERNTIVELY: Filtering using mongoose methods
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

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

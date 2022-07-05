const Tour = require('./../models/tourModel');

// Middleware checking if body is valid
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    // Simple error handling
    return res.status(404).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

///////////////////////////////////////////////////////////////////
// Route Handler functions aka Controllers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    // Format the response using JSend
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // req.params will return an object with the parameters specified /:param
  // Converting to a number
  const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);

  // // Return the tour if found
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  // Status 201 means created
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

exports.updateTour = (req, res) => {
  // Not actually implementing updating the tour
  res.status(200).json({
    status: 'success',
    // data: { tour: 'Updated tour here' },
  });
};

exports.deleteTour = (req, res) => {
  // Not actually implementing deleting the tour
  // Status 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

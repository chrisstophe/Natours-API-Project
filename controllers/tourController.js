const fs = require('fs');

// Top level code is only executed once so it's better to read files once
// Read tours data from file and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Middleware checking if ID exists
exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID is ${val}`);
  if (+req.params.id > tours.length) {
    // Simple error handling
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

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
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // req.params will return an object with the parameters specified /:param
  // Converting to a number
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  // Return the tour if found
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  //   "Creating" and ID for the new tour
  const newId = tours[tours.length - 1].id + 1;
  // Adding the ID to the tour
  const newTour = Object.assign({ id: newId }, req.body);
  // Add the new tour to the tours array
  tours.push(newTour);
  // Persist the new tours away to our JSON file = "Database"
  // In a callback so make sure this is done ASYNC
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // Status 201 means created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  // Not actually implementing updating the tour
  res.status(200).json({
    status: 'success',
    data: { tour: 'Updated tour here' },
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

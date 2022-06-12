const fs = require('fs');
const express = require('express');
const { fail } = require('assert');
const morgan = require('morgan');

// Setting up a simple server with Express
const app = express();

///////////////////////////////////////////////////////////////////////////////
// Middleware Stack
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('HELLO FROM THE MIDDLEWARE');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Top level code is only executed once so it's better to read files once
// Read tours data from file and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

///////////////////////////////////////////////////////////////////////////////
// Route Handler functions
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
  // req.params will return an object with the parameters specified /:param
  // Converting to a number
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  // Simple error handling
  if (!tour) {
    return res.status(404).json({
      status: fail,
      message: 'Invalid ID',
    });
  }

  // Return the tour if found
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  // Simple error handling
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: fail,
      message: 'Invalid ID',
    });
  }
  // Not actually implementing updating the tour
  res.status(200).json({
    status: 'success',
    data: { tour: 'Updated tour here' },
  });
};

const deleteTour = (req, res) => {
  // Simple error handling
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: fail,
      message: 'Invalid ID',
    });
  }
  // Not actually implementing deleting the tour
  // Status 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

///////////////////////////////////////////////////////////////////////////////
// Handling GET and POST requests
app.route('/api/v1/tours').get(getAllTours).post(createTour);

// Handling GET specific tour, PATCH, and DELETE requests
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

///////////////////////////////////////////////////////////////////////////////
// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

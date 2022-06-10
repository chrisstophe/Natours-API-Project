const fs = require('fs');
const express = require('express');

// Setting up a simple server with Express
const app = express();

// We need middleware, more details later
app.use(express.json());

// Quick Express Demo
// Defining routes in Express
// Specify the HTTP method and the URL
// app.get('/', (req, res) => {
//   // Easily specify the status with Express
//   // Using the .json() method automatically sets the content type to JSON with Express
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// Top level code is only executed once so it's better to read files once
// Read tours data from file and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Handling GET requests
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    // Format the response using JSend
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Handling POST requests
app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

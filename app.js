const fs = require('fs');
const express = require('express');

// Setting up a simple server with Express
const app = express();

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

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

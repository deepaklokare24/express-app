const fs = require('fs');
const express = require('express');
const { getTourById, updateToursSourceFile } = require('./utils/helper');

const app = express();
app.use(express.json());

const toursFileName = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursFileName));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from server side 😃', author: 'Deepak Lokare' });
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const tour = getTourById(req, tours);

  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } else {
    res.status(404).send('Invalid Id');
  }
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  updateToursSourceFile(toursFileName, tours, newTour, res);
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = getTourById(req, tours);

  if (tour) {
    const updatedTour = { ...tour, ...req.body };

    // update the tours source data
    const newTours = tours.map((item) => {
      if (item.id === tour.id) {
        return { ...tour, ...updatedTour };
      }
      return item;
    });
    updateToursSourceFile(toursFileName, newTours, updatedTour, res);
  } else {
    res.status(404).send('Invalid Id');
  }
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const tour = getTourById(req, tours);

  if (tour) {
    // filter tours source data by removing this tour
    const newTours = tours.filter((item) => {
      if (item.id !== tour.id) {
        return item;
      }
    });
    console.log(newTours);
    res.status(204).send('done');
    // Not deleting from source file as of now
    //updateToursSourceFile(toursFileName, newTours, updatedTour, res);
  } else {
    res.status(404).send('Invalid Id');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log('Listening on port number 3000...');
});

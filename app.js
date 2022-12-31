const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { getTourById, updateToursSourceFile } = require('./utils/helper');

const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

// setup the logger
app.use(morgan('common', { stream: accessLogStream }));

app.use(function (req, res, next) {
  console.log('Hello from MIddleware 👋🏻');
  next();
});

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
app.use(express.json());

const toursFileName = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursFileName));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from server side 😃', author: 'Deepak Lokare' });
});

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  updateToursSourceFile(toursFileName, tours, newTour, res);
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
  const tour = getTourById(req, tours);

  if (tour) {
    // filter tours source data by removing this tour
    const newTours = tours.filter((item) => {
      if (item.id !== tour.id) {
        return item;
      }
    });
    res.status(204).send('done');
    // Not deleting from source file as of now
    //updateToursSourceFile(toursFileName, newTours, updatedTour, res);
  } else {
    res.status(404).send('Invalid Id');
  }
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('Listening on port number 3000...');
});

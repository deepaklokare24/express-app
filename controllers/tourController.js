const fs = require('fs');
const { getTourById, updateToursSourceFile } = require('../utils/helper');
const toursFileName = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursFileName));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  updateToursSourceFile(toursFileName, tours, newTour, res);
};

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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

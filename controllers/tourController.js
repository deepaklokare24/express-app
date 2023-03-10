/* eslint-disable node/no-unsupported-features/es-syntax */
const fs = require('fs');
const { getTourById, updateToursSourceFile } = require('../utils/helper');

const toursFileName = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursFileName));

exports.checkValidTourId = (req, res, next, value) => {
  const id = value * 1;
  const isValidTour = tours.find((item) => item.id === id);

  if (!isValidTour) {
    return res.status(404).json({
      status: 'Failure',
      message: 'Invalid Tour Id',
    });
  }
  next();
};

exports.validateTourPayload = (req, res, next) => {
  const payload = req.body;
  if (Object.keys(payload).length) {
    const isValidTour =
      'name' in payload &&
      'duration' in payload &&
      'maxGroupSize' in payload &&
      'difficulty' in payload;

    if (!isValidTour) {
      return res.status(400).json({
        status: 'Failure',
        message:
          'Invalid Tour parameters, Please specify following mandatory fields: name, duration, maxGroupSize and difficulty',
      });
    }
  }
  next();
};

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
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  updateToursSourceFile(toursFileName, tours, newTour, res);
};

exports.updateTour = (req, res) => {
  const tour = getTourById(req, tours);
  const updatedTour = { ...tour, ...req.body };

  // update the tours source data
  const newTours = tours.map((item) => {
    if (item.id === tour.id) {
      return { ...tour, ...updatedTour };
    }
    return item;
  });
  updateToursSourceFile(toursFileName, newTours, updatedTour, res);
};

exports.deleteTour = (req, res) => {
  const tour = getTourById(req, tours);
  // filter tours source data by removing this tour
  const newTours = tours.filter((item) => item.id !== tour.id);
  res.status(204).send('done');
  console.log(newTours);
  // Not deleting from source file as of now
  //updateToursSourceFile(toursFileName, newTours, updatedTour, res);
};

const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoutes');
const { accessLogStream } = require('./logger');
const app = express();

// setup the logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: accessLogStream }));
}

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
app.use('/api/v1/tours', tourRoute);

module.exports = app;

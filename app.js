const express = require('express');
const tourRoute = require('./routes/tourRoutes');
const app = express();

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use(express.json());
app.use('/api/v1/tours', tourRoute);

module.exports = app;

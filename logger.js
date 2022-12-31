const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = require('./app');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

// setup the logger
app.use(morgan('common', { stream: accessLogStream }));

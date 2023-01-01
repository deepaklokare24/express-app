const mongoose = require('mongoose');
const dotEnv = require('dotenv');

dotEnv.config();

const app = require('./app');
require('./logger');

const { DB_URL, PORT } = process.env;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Database connection is successful!');
  })
  .catch((err) => {
    console.log(err);
  });

const port = PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port number 3000...');
});

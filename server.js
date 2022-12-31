const dotEnv = require('dotenv');
dotEnv.config({ path: './config.env' });

const app = require('./app');
require('./logger');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port number 3000...');
});

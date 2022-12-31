const app = require('./app');
require('./logger');

const port = 3000;
app.listen(port, () => {
  console.log('Listening on port number 3000...');
});

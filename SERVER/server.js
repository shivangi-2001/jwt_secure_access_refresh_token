const app = require('./app');
const dotenv = require('dotenv');
const { port } = require('./config');

dotenv.config();


// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

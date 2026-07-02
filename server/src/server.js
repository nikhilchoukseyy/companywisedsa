const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./db');

async function start() {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`API server running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

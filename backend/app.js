/**
 * Load and return an Express app.
 * @return {Promise<Express>}
 */
async function loadApp() {
  console.log('Loading...')

  try {
    await Promise.all([
      require('./loaders/graphDB').load(),
    ]);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  // MongoDB loads synchronously
  require('./loaders/mongoDB');

  // return express app
  return require('./loaders/express');
}

process.on('SIGINT', function () {
  console.log('Received SIGINT.');
  process.exit(0);
});

process.on('SIGTERM', function () {
  console.log('Received SIGTERM.');
  process.exit(0);
});

module.exports = loadApp;

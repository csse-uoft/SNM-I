function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Only exports modules without circular imports
module.exports = {
  sleep,
  ...require('./error'),
  ...require('./hashing'),
  ...require('./mailer')
}

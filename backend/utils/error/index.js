class NotImplementedError extends Error {
  constructor(name = 'Unset') {
    super(`${name} is not implemented.`);
  }
}

module.exports = {
  NotImplementedError,
}

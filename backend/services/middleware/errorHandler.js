const isProduction = process.env.NODE_ENV === 'production';

/**
 * Express error handler has four parameters.
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  const {message, statusCode, stack, ...others} = err;
  res.status(statusCode || 500).json({
    success: false,
    detail: others,
    message: message,
    stack: isProduction ? undefined : stack,
  });
}

module.exports = {errorHandler};

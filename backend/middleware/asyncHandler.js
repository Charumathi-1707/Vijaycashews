// Wraps async controller functions so any thrown error or rejected promise
// is forwarded to Express error handler instead of hanging the request.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // If response was already sent, just log — don't try to send again
    if (res.headersSent) {
      console.error('Error after headers sent:', err.message);
      return;
    }
    next(err);
  });
};

module.exports = asyncHandler;

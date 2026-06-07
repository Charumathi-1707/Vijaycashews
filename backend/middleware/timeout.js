// Request timeout middleware
// If a request takes longer than 30s, respond with 503 instead of hanging forever
const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`⏱️  Request timeout: ${req.method} ${req.originalUrl}`);
        res.status(503).json({
          success: false,
          message: 'Request timed out. Please try again.',
        });
      }
    }, timeoutMs);

    // Clear timeout once response is finished
    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));

    next();
  };
};

module.exports = requestTimeout;

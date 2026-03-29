const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("Global error:", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
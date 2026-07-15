const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({
      error: "malformatted id",
    });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    return response.status(400).json({
      error: "expected `username` to be unique",
    });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
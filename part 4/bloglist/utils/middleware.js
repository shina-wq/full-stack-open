const jwt = require("jsonwebtoken");

const User = require("../models/user");
const config = require("./config");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: "token missing",
      });
    }

    const decodedToken = jwt.verify(request.token, config.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({
        error: "token invalid",
      });
    }

    request.user = await User.findById(decodedToken.id);

    next();
  } catch (error) {
    next(error);
  }
};

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

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "token invalid",
    });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler,
};
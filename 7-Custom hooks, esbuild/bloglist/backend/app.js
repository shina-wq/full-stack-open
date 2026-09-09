const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./utils/config");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:");
    console.error(error);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
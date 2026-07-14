const express = require("express");
const mongoose = require("mongoose");

const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");

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

app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
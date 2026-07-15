const express = require("express");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const config = require("../utils/config");

const blogsRouter = express.Router();

const getTokenFrom = request => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  try {
    const token = getTokenFrom(req);

    const decodedToken = jwt.verify(token, config.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({
        error: "token invalid",
      });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      ...req.body,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);

    res.status(401).json({
      error: "token missing or invalid",
    });
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

module.exports = blogsRouter;
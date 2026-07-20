const express = require("express");
const middleware = require("../utils/middleware");

const Blog = require("../models/blog");

const blogsRouter = express.Router();

blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  res.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
    const user = req.user;

    const blog = new Blog({
      ...req.body,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
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

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const user = req.user;

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      error: "blog not found",
    });
  }

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(401).json({
      error: "only the creator can delete this blog",
    });
  }

  user.blogs = user.blogs.filter(
    blogId => blogId.toString() !== blog._id.toString()
  );

  await user.save();

  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

module.exports = blogsRouter;
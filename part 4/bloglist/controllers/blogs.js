const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );

  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

module.exports = blogsRouter;
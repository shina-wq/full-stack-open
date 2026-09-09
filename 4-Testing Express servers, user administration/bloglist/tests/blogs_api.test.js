const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger Dijkstra",
    url: "https://example.com",
    likes: 5,
  },
];

const loginAndGetToken = async () => {
  const response = await api
    .post("/api/login")
    .send({
      username: "root",
      password: "sekret",
    });

  return response.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);

  const user = new User({
    username: "root",
    name: "Superuser",
    passwordHash,
  });

  const savedUser = await user.save();

  const blogObjects = initialBlogs.map(
    blog =>
      new Blog({
        ...blog,
        user: savedUser._id,
      })
  );

  const savedBlogs = await Blog.insertMany(blogObjects);

  await User.findByIdAndUpdate(
    savedUser._id,
    {
      blogs: savedBlogs.map(blog => blog._id),
    }
  );
});

describe("when there are initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });
});

test("blog posts have id property instead of _id", async () => {
  const response = await api.get("/api/blogs");

  assert(response.body[0].id);
  assert.strictEqual(response.body[0]._id, undefined);
});

test("a valid blog can be added", async () => {
  const token = await loginAndGetToken();

  const newBlog = {
    title: "The Art of Testing",
    author: "Shina",
    url: "https://example.com/testing",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const titles = response.body.map(blog => blog.title);

  assert(titles.includes(newBlog.title));
});

test("adding a blog fails with status code 401 if token is not provided", async () => {
  const newBlog = {
    title: "Unauthorized blog",
    author: "Shina",
    url: "https://example.com",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401);

  const blogs = await Blog.find({});

  assert.strictEqual(blogs.length, initialBlogs.length);
});

test("if likes is missing, it defaults to 0", async () => {
  const token = await loginAndGetToken();

  const newBlog = {
    title: "Blog without likes",
    author: "Shina",
    url: "https://example.com/no-likes",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  assert.strictEqual(response.body.likes, 0);
});

test("a blog without title is not created", async () => {
  const token = await loginAndGetToken();

  const newBlog = {
    author: "Shina",
    url: "https://example.com/no-title",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("a blog without url is not created", async () => {
  const token = await loginAndGetToken();

  const newBlog = {
    title: "Blog without URL",
    author: "Shina",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("a blog can be deleted", async () => {
  const token = await loginAndGetToken();

  const blogsAtStart = (await Blog.find({})).map(blog => blog.toJSON());

  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = (await Blog.find({})).map(blog => blog.toJSON());

  assert.strictEqual(
    blogsAtEnd.length,
    blogsAtStart.length - 1
  );

  const titles = blogsAtEnd.map(blog => blog.title);

  assert(!titles.includes(blogToDelete.title));
});

test("a blog's likes can be updated", async () => {
  const blogsAtStart = (await Blog.find({})).map(blog => blog.toJSON());

  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

  const blogsAtEnd = (await Blog.find({})).map(blog => blog.toJSON());

  const updated = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);

  assert.strictEqual(updated.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
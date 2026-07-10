const { test, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");

const mongoose = require("mongoose");

const app = require("../app");
const Blog = require("../models/blog");

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

before(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));

  await Blog.insertMany(blogObjects);
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

  const blogs = response.body;

  assert.strictEqual(blogs[0].id !== undefined, true);
  assert.strictEqual(blogs[0]._id, undefined);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "The Art of Testing",
    author: "Shina",
    url: "https://example.com/testing",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);

  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  assert(titles.includes("The Art of Testing"));
});

test("if likes is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Shina",
    url: "https://example.com/no-likes",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201);

  assert.strictEqual(response.body.likes, 0);
});

test("a blog without title is not created", async () => {
  const newBlog = {
    author: "Shina",
    url: "https://example.com/no-title",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);
});


test("a blog without url is not created", async () => {
  const newBlog = {
    title: "Blog without URL",
    author: "Shina",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);
});
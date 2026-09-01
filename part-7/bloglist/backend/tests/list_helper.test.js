const { test, describe } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);

  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);

    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const blogs = [
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        likes: 5,
      },
    ];

    const result = listHelper.totalLikes(blogs);

    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated correctly", () => {
    const blogs = [
      { title: "Blog 1", likes: 5 },
      { title: "Blog 2", likes: 10 },
      { title: "Blog 3", likes: 7 },
    ];

    const result = listHelper.totalLikes(blogs);

    assert.strictEqual(result, 22);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);

    assert.strictEqual(result, null);
  });

  test("of a single blog is that blog", () => {
    const blogs = [
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://example.com",
        likes: 5,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);

    assert.deepStrictEqual(result, blogs[0]);
  });

  test("of a bigger list is the one with most likes", () => {
    const blogs = [
      {
        title: "Blog 1",
        author: "Author 1",
        likes: 7,
      },
      {
        title: "Blog 2",
        author: "Author 2",
        likes: 15,
      },
      {
        title: "Blog 3",
        author: "Author 3",
        likes: 10,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);

    assert.deepStrictEqual(result, blogs[1]);
  });
});

describe("most blogs", () => {
  test("returns author with most blogs", () => {
    const blogs = [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        likes: 10,
      },
      {
        title: "Clean Architecture",
        author: "Robert C. Martin",
        likes: 15,
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        likes: 20,
      },
    ];

    const result = listHelper.mostBlogs(blogs);

    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2,
    });
  });
});

describe("most likes", () => {
  test("returns author whose blogs have the most likes", () => {
    const blogs = [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        likes: 10,
      },
      {
        title: "Clean Architecture",
        author: "Robert C. Martin",
        likes: 15,
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        likes: 20,
      },
    ];

    const result = listHelper.mostLikes(blogs);

    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      likes: 25,
    });
  });
});
const dummy = (_blogs) => 1;

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const topAuthor = Object.entries(authors).reduce(
    (best, [author, blogs]) =>
      blogs > best.blogs ? { author, blogs } : best,
    { author: null, blogs: 0 }
  );

  return topAuthor;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.reduce((totals, blog) => {
    totals[blog.author] = (totals[blog.author] || 0) + blog.likes;
    return totals;
  }, {});

  return Object.entries(authors).reduce(
    (best, [author, likes]) =>
      likes > best.likes ? { author, likes } : best,
    { author: null, likes: 0 }
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
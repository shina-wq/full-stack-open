const BlogView = ({
  blog,
  user,
  likeBlog,
  deleteBlog,
}) => {
  if (!blog) {
    return null
  }

  return (
    <>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>
        <a href={blog.url}>
          {blog.url}
        </a>
      </div>

      <div>
        {blog.likes} likes{" "}

        {user && (
          <button onClick={() => likeBlog(blog)}>
            like
          </button>
        )}
      </div>

      <div>added by {blog.user.name}</div>

      {user?.username === blog.user.username && (
        <button onClick={() => deleteBlog(blog)}>
          remove
        </button>
      )}
    </>
  )
}

export default BlogView
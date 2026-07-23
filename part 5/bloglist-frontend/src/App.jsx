import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(
        blogs.sort((a, b) => b.likes - a.likes)
      )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Show notification
  const showNotification = message => {
    setNotification(message)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Login
  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername("")
      setPassword("")

      showNotification(`Welcome ${user.name}`)
    } catch {
      showNotification("wrong username or password")
    }
  }

  // Logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    blogService.setToken(null)
    setUser(null)
  }

  // Create blog
  const handleCreateBlog = async newBlog => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create(newBlog)

      setBlogs(
        blogs
          .concat(returnedBlog)
          .sort((a, b) => b.likes - a.likes)
        )

      showNotification(`a new blog "${returnedBlog.title}" added`)
    } catch {
      showNotification("creating blog failed")
    }
  }

  // like blog
  const handleLikeBlog = async blog => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs(
        blogs
          .map(b => (b.id === blog.id ? returnedBlog : b))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch {
      showNotification("updating likes failed")
    }
  }

  // delete blog
  const handleDeleteBlog = async blog => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)

      setBlogs(
        blogs.filter(b => b.id !== blog.id)
      )

      showNotification(`"${blog.title}" deleted`)
    } catch {
      showNotification("deleting blog failed")
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log into application</h2>

        <Notification message={notification} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification} />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable
        buttonLabel="create new blog"
        ref={blogFormRef}
      >
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={handleLikeBlog}
          deleteBlog={handleDeleteBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
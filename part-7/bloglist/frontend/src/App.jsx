import { useState, useEffect } from "react"
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom"

import Blog from "./components/Blog"
import Notification from "./components/Notification"
import BlogView from "./components/BlogView"
import CreateBlogView from "./components/CreateBlogView"
import Navigation from "./components/Navigation"
import ErrorBoundary from "./components/ErrorBoundary"

import blogService from "./services/blogs"
import loginService from "./services/login"

import { Box, Button, TextField, Typography } from "@mui/material"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
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

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))

      blogService.setToken(user.token)

      setUser(user)
      setUsername("")
      setPassword("")

      showNotification(`Welcome ${user.name}`)
      navigate("/")
    } catch {
      showNotification("wrong username or password", "error")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    blogService.setToken(null)
    setUser(null)

    navigate("/")
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)

      setBlogs((prev) =>
        prev.concat(returnedBlog).sort((a, b) => b.likes - a.likes),
      )

      showNotification(`a new blog "${returnedBlog.title}" added`)

      navigate("/")
    } catch {
      showNotification("creating blog failed", "error")
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs((prev) =>
        prev
          .map((b) => (b.id === blog.id ? returnedBlog : b))
          .sort((a, b) => b.likes - a.likes),
      )
    } catch {
      showNotification("Updating likes failed", "error")
    }
  }

  const handleDeleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)

      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))

      showNotification(`"${blog.title}" deleted`)
      navigate("/")
    } catch {
      showNotification("Deleting blog failed", "error")
    }
  }

  const match = useMatch("/blogs/:id")

  const selectedBlog = match
    ? blogs.find((b) => b.id === match.params.id)
    : null

  const blogList = (
    <>
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={handleLikeBlog}
          deleteBlog={handleDeleteBlog}
          user={user}
        />
      ))}
    </>
  )

  const loginForm = (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Log into application
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />

      <ErrorBoundary>
        <Notification notification={notification} />

        <Routes>
          <Route path="/" element={user ? blogList : loginForm} />

          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : loginForm}
          />

          <Route
            path="/blogs/:id"
            element={
              selectedBlog ? (
                <BlogView
                  blog={selectedBlog}
                  user={user}
                  likeBlog={handleLikeBlog}
                  deleteBlog={handleDeleteBlog}
                />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />

          <Route
            path="/create"
            element={
              user ? (
                <CreateBlogView createBlog={handleCreateBlog} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={<Typography variant="h5">Page not found</Typography>}
          />
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App

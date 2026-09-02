import { useEffect, useState } from "react"
import {
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from "react-router-dom"

import { Box, Button, TextField, Typography } from "@mui/material"

import Blog from "./components/Blog"
import BlogView from "./components/BlogView"
import CreateBlogView from "./components/CreateBlogView"
import ErrorBoundary from "./components/ErrorBoundary"
import Navigation from "./components/Navigation"
import Notification from "./components/Notification"
import useField from "./hooks/useField"

import useBlogStore from "./stores/blogStore"
import useNotificationStore from "./stores/notificationStore"
import useUserStore from "./stores/userStore"

const App = () => {
  const username = useField("text")
  const password = useField("password")
  const [blogsLoaded, setBlogsLoaded] = useState(false)

  const user = useUserStore((state) => state.user)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const createBlog = useBlogStore((state) => state.createBlog)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const deleteBlog = useBlogStore((state) => state.deleteBlog)

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const navigate = useNavigate()
  const match = useMatch("/blogs/:id")

  useEffect(() => {
    initializeBlogs().finally(() => setBlogsLoaded(true))
    initializeUser()
  }, [initializeBlogs, initializeUser])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await login({
        username: username.value,
        password: password.value,
      })

      username.reset()
      password.reset()

      showNotification(`Welcome ${loggedInUser.name}`)
      navigate("/")
    } catch {
      showNotification("wrong username or password", "error")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const returnedBlog = await createBlog(newBlog)

      showNotification(`a new blog "${returnedBlog.title}" added`)
      navigate("/")
    } catch {
      showNotification("creating blog failed", "error")
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      await likeBlog(blog)
    } catch {
      showNotification("Updating likes failed", "error")
    }
  }

  const handleDeleteBlog = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    )

    if (!confirmed) return

    try {
      await deleteBlog(blog)
      showNotification(`"${blog.title}" deleted`)
      navigate("/")
    } catch {
      showNotification("Deleting blog failed", "error")
    }
  }

  const selectedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  const blogList = (
    <>
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
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
          type={username.type}
          value={username.value}
          onChange={username.onChange}
        />

        <TextField
          label="Password"
          type={password.type}
          value={password.value}
          onChange={password.onChange}
        />

        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </Box>
  )

  const renderBlogView = () => {
    if (!blogsLoaded) return null
    if (!selectedBlog) return <Navigate replace to="/" />

    return (
      <BlogView
        blog={selectedBlog}
        user={user}
        likeBlog={handleLikeBlog}
        deleteBlog={handleDeleteBlog}
      />
    )
  }

  return (
    <>
      <Navigation onLogout={handleLogout} />

      <ErrorBoundary>
        <Notification />

        <Routes>
          <Route path="/" element={user ? blogList : loginForm} />

          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : loginForm}
          />

          <Route path="/blogs/:id" element={renderBlogView()} />

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
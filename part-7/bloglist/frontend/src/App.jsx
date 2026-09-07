import { useEffect, useState } from "react"
import {
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from "react-router-dom"

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material"

import Blog from "./components/Blog"
import BlogView from "./components/BlogView"
import CreateBlogView from "./components/CreateBlogView"
import ErrorBoundary from "./components/ErrorBoundary"
import Navigation from "./components/Navigation"
import Notification from "./components/Notification"
import UserView from "./components/UserView"
import UsersView from "./components/UsersView"
import useField from "./hooks/useField"

import useBlogStore from "./stores/blogStore"
import useNotificationStore from "./stores/notificationStore"
import useUserStore from "./stores/userStore"
import useUsersStore from "./stores/usersStore"

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

  const users = useUsersStore((state) => state.users)
  const usersLoading = useUsersStore((state) => state.loading)
  const initializeUsers = useUsersStore((state) => state.initializeUsers)
  const addComment = useBlogStore((state) => state.addComment)

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const navigate = useNavigate()

  // Fixed: these were "/blogs/" and "/users/" (literal), which never matched
  // an id and left selectedBlog/selectedUser permanently null.
  const match = useMatch("/blogs/:id")
  const userMatch = useMatch("/users/:id")

  useEffect(() => {
    initializeBlogs().finally(() => setBlogsLoaded(true))
    initializeUsers()
    initializeUser()
  }, [initializeBlogs, initializeUsers, initializeUser])

  const selectedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  const selectedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

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
    // Fixed: missing backticks made this a syntax error
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
    if (!blogsLoaded) return <CircularProgress />
    if (!selectedBlog) return <Navigate replace to="/" />

    return (
      <BlogView
        blog={selectedBlog}
        user={user}
        likeBlog={handleLikeBlog}
        deleteBlog={handleDeleteBlog}
        addComment={addComment}
      />
    )
  }

  const renderUserView = () => {
    if (usersLoading) return <CircularProgress />
    if (!selectedUser) return <Navigate replace to="/users" />

    return <UserView user={selectedUser} />
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
            path="/users"
            element={user ? <UsersView /> : <Navigate replace to="/login" />}
          />

          <Route
            path="/users/:id"
            element={
              user ? renderUserView() : <Navigate replace to="/login" />
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
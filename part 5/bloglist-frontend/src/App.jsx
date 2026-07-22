import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // show notification
  const showNotification = message => {
    setNotification(message)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // login handler
  const handleLogin = async event => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password,
    })

    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(user)
    )

    blogService.setToken(user.token)

    setUser(user)
    setUsername('')
    setPassword('')

    setNotification(`Welcome ${user.name}`)
  } catch (exception) {
    setNotification("wrong username or password")
  }
}

  // logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    blogService.setToken(null)
    setUser(null)
  }

  // create blog handler
  const handleCreateBlog = async event => {
    event.preventDefault()

    try {
      const returnedBlog = await blogService.create({
        title,
        author,
        url,
      })

      setBlogs(blogs.concat(returnedBlog))

      setTitle("")
      setAuthor("")
      setUrl("")

      setNotification(`a new blog "${returnedBlog.title}" added`)
    } catch (exception) {
      setNotification("creating blog failed")
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log into application</h2>

        <Notification message={notification}/>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({target}) => setUsername(target.value)}
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({target})  => setPassword(target.value)}
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
      <Notification message={notification}/>

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <h3>create new</h3>

      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            value={title}
            onChange={({target}) => setTitle(target.value)}
          />
        </div>

        <div>
          author:
          <input
            value={author}
            onChange={({target}) => setAuthor(target.value)}
          />
        </div>

        <div>
          url:
          <input
            value={url}
            onChange={({target}) => setUrl(target.value)}
          />
        </div>

        <button type="submit">
          create
        </button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
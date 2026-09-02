const getUser = () => {
  const userJSON = window.localStorage.getItem("loggedBlogappUser")

  return userJSON ? JSON.parse(userJSON) : null
}

const saveUser = (user) => {
  window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem("loggedBlogappUser")
}

export { getUser, saveUser, removeUser }
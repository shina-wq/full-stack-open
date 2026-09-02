import { create } from "zustand"

import blogService from "../services/blogs"
import loginService from "../services/login"
import { getUser, removeUser, saveUser } from "../services/persistentUser"

const useUserStore = create((set) => ({
  user: null,

  initializeUser: () => {
    const user = getUser()

    if (!user) return

    blogService.setToken(user.token)
    set({ user })
  },

  login: async (credentials) => {
    const user = await loginService.login(credentials)

    saveUser(user)
    blogService.setToken(user.token)

    set({ user })

    return user
  },

  logout: () => {
    removeUser()
    blogService.setToken(null)

    set({ user: null })
  },
}))

export default useUserStore
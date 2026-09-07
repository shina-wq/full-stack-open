import { create } from "zustand"

import userService from "../services/users"

const useUsersStore = create((set) => ({
  users: [],
  loading: false,

  initializeUsers: async () => {
    set({ loading: true })

    try {
      const users = await userService.getAll()
      set({ users })
    } finally {
      set({ loading: false })
    }
  },
}))

export default useUsersStore

import { create } from "zustand"

const useNotificationStore = create((set) => ({
  notification: null,

  showNotification: (message, type = "success") => {
    set({ notification: { message, type } })

    setTimeout(() => {
      set({ notification: null })
    }, 5000)
  },
}))

export default useNotificationStore
import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  message: '',

  setNotification: (message) => {
    set({ message })

    setTimeout(() => {
      set({ message: '' })
    }, 5000)
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.message)
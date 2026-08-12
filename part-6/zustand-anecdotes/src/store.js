import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',

  actions: {
    initialize: async () => {
      const response = await fetch('http://localhost:3001/anecdotes')
      const anecdotes = await response.json()

      set({ anecdotes })
    },

    vote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((anecdote) => anecdote.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1,
      }

      const response = await fetch(
        `http://localhost:3001/anecdotes/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAnecdote),
        }
      )

      const savedAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id ? savedAnecdote : anecdote
        ),
      }))

      useNotificationStore
        .getState()
        .setNotification(`voted for "${anecdote.content}"`)
    },

    create: async (content) => {
      const newAnecdote = {
        content,
        votes: 0,
      }

      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnecdote),
      })

      const savedAnecdote = await response.json()

      set((state) => ({
        anecdotes: [...state.anecdotes, savedAnecdote],
      }))

      useNotificationStore
        .getState()
        .setNotification(`created "${content}"`)
    },

    remove: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((anecdote) => anecdote.id === id)

      if (!anecdote || anecdote.votes > 0) return

      await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: 'DELETE',
      })

      set((state) => ({
        anecdotes: state.anecdotes.filter(
          (anecdote) => anecdote.id !== id
        ),
      }))
    },

    setFilter: (filter) => set({ filter }),
  },
}))

export const useAnecdotes = () =>
  useAnecdoteStore((state) => state.anecdotes)

export const useFilter = () =>
  useAnecdoteStore((state) => state.filter)

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)
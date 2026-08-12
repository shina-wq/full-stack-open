import { describe, expect, it, vi } from 'vitest'
import { useAnecdoteStore } from './store'

describe('anecdote store', () => {
  it('initializes anecdotes from the backend', async () => {
    const anecdotes = [
      {
        id: '1',
        content: 'Test anecdote',
        votes: 0,
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(anecdotes),
      })
    )

    await useAnecdoteStore.getState().actions.initialize()

    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)

    vi.unstubAllGlobals()
  })

  it('increases votes when an anecdote is voted for', async () => {
    const anecdotes = [
      {
        id: '1',
        content: 'Test anecdote',
        votes: 0,
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ ...anecdotes[0], votes: 1 }),
      })
    )

    useAnecdoteStore.setState({ anecdotes })

    await useAnecdoteStore.getState().actions.vote('1')

    expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(1)

    vi.unstubAllGlobals()
  })
})
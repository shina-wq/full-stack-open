import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AnecdoteList from './AnecdoteList'

const { mockUseFilter } = vi.hoisted(() => ({
  mockUseFilter: vi.fn(),
}))

afterEach(() => {
  cleanup()
})

vi.mock('../store', () => ({
  useAnecdotes: () => [
    {
      id: '1',
      content: 'Least votes',
      votes: 1,
    },
    {
      id: '2',
      content: 'Most votes',
      votes: 5,
    },
    {
      id: '3',
      content: 'Middle votes',
      votes: 3,
    },
  ],
  useFilter: () => mockUseFilter(),
}))

vi.mock('./Anecdote', () => ({
  default: ({ anecdote }) => <div>{anecdote.content}</div>,
}))

describe('AnecdoteList', () => {
  it('displays anecdotes sorted by votes', () => {
    mockUseFilter.mockReturnValue('')

    render(<AnecdoteList />)

    const anecdotes = screen.getAllByText(
      /Least votes|Most votes|Middle votes/
    )

    expect(anecdotes[0]).toHaveTextContent('Most votes')
    expect(anecdotes[1]).toHaveTextContent('Middle votes')
    expect(anecdotes[2]).toHaveTextContent('Least votes')
  })

  it('displays only anecdotes matching the filter', () => {
    mockUseFilter.mockReturnValue('most')

    render(<AnecdoteList />)

    expect(screen.getByText('Most votes')).toBeInTheDocument()
    expect(screen.queryByText('Middle votes')).not.toBeInTheDocument()
    expect(screen.queryByText('Least votes')).not.toBeInTheDocument()
  })
})
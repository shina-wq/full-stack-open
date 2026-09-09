import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAnecdote,
  getAnecdotes,
  voteAnecdote,
} from '../services/anecdotes'
import { useNotify } from '../contexts/NotificationContext'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: (_, content) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`a new anecdote "${content}" created!`)
    },

    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    },
  })

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  return {
    ...anecdotesQuery,
    createAnecdote: createMutation.mutate,
    voteAnecdote: voteMutation.mutate,
  }
}
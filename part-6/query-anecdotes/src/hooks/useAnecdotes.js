import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAnecdote,
  getAnecdotes,
  voteAnecdote,
} from '../services/anecdotes'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
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
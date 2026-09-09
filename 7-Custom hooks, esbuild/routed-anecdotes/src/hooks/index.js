import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    input: {
      type,
      value,
      onChange
    },
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => {
      setAnecdotes(data)
    })
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)

    setAnecdotes(prev => [...prev, newAnecdote])
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)

    setAnecdotes(prev =>
      prev.filter(anecdote => anecdote.id !== id)
    )
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}
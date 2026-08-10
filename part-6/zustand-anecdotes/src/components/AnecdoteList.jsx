import { useAnecdotes, useFilter } from '../store'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filteredAnecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} />
      ))}
    </div>
  )
}

export default AnecdoteList
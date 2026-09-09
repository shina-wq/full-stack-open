import { useAnecdoteActions } from "../store"

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()

  const addAnecdote = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value

    create(content)
    event.target.anecdote.value = ""
  }

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>

        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
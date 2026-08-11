import { useAnecdoteActions } from '../store'

const Anecdote = ({ anecdote }) => {
  const { vote, remove } = useAnecdoteActions()

  return (
    <div>
      <div>{anecdote.content}</div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center"}}>
        has {anecdote.votes} votes
        <button onClick={() => vote(anecdote.id)}>vote</button>

        {anecdote.votes === 0 && (
          <button onClick={() => {
            if (window.confirm("Delete this anecdote?")) {
              remove(anecdote.id)
            }
          }}
          >
            delete
          </button>
        )}
      </div>
    </div>
  )
}

export default Anecdote
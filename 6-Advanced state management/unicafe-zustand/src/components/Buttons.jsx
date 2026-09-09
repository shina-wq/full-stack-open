import useStore from "../store"

const Buttons = () => {
  const voteGood = useStore((state) => state.voteGood)
  const voteNeutral = useStore((state) => state.voteNeutral)
  const voteBad = useStore((state) => state.voteBad)

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={voteGood}>good</button>
      <button onClick={voteNeutral}>neutral</button>
      <button onClick={voteBad}>bad</button>
    </div>
  )
}

export default Buttons
import { useNotification } from "../notificationStore"

const Notification = () => {
  const message = useNotification()

  if (!message) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{message}</div>
}

export default Notification
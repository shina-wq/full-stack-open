import Alert from "@mui/material/Alert"

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type} sx={{ mb: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification

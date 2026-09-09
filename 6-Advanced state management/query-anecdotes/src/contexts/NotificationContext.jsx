import { createContext, useCallback, useContext, useRef, useState } from 'react'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef(null)

  const notify = useCallback((message) => {
    setNotification(message)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 5000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotify must be used within NotificationProvider')
  }

  return context
}
import { Component } from "react"
import { Box, Typography } from "@mui/material"

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Something went wrong.</Typography>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

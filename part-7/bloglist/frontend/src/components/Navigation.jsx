import { Link } from "react-router-dom"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"

const Navigation = ({ user, onLogout }) => (
  <AppBar position="static" sx={{ mb: 3 }}>
    <Toolbar>
      <Button color="inherit" component={Link} to="/">
        Blogs
      </Button>

      {user && (
        <Button color="inherit" component={Link} to="/create">
          Create
        </Button>
      )}

      <Box sx={{ flexGrow: 1 }} />

      {!user ? (
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      ) : (
        <>
          <Typography sx={{ mr: 2 }}>{user.name}</Typography>

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </>
      )}
    </Toolbar>
  </AppBar>
)

export default Navigation

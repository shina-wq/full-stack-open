import { Link } from "react-router-dom"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import useUserStore from "../stores/userStore"

const Navigation = ({ onLogout }) => {
  const user = useUserStore((state) => state.user)

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", mr: 2 }}
        >
          Blogs
        </Typography>

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
}

export default Navigation
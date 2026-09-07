import { Link } from "react-router-dom"
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"

import useUsersStore from "../stores/usersStore"

const UsersView = () => {
  const users = useUsersStore((state) => state.users)
  const loading = useUsersStore((state) => state.loading)

  if (loading) {
    return <CircularProgress />
  }

  if (users.length === 0) {
    return <Typography>No users found.</Typography>
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Link
                    to={`/users/${user.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {user.name}
                  </Link>
                </TableCell>

                <TableCell align="right">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UsersView

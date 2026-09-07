import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material"

const UserView = ({ user }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {user.name}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Added blogs
      </Typography>

      {user.blogs.length === 0 ? (
        <Typography color="text.secondary">
          This user hasn't added any blogs.
        </Typography>
      ) : (
        <List
          component={Paper}
          sx={{ maxWidth: 700 }}
        >
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} divider>
              <ListItemText
                primary={blog.title}
                secondary={`by ${blog.author}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}

export default UserView

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

const BlogView = ({ blog, user, likeBlog, deleteBlog, addComment }) => {
  const [comment, setComment] = useState("")

  if (!blog) {
    return null
  }

  const comments = blog.comments ?? []

  const handleComment = async (event) => {
    event.preventDefault()

    if (!comment.trim()) return

    await addComment(blog, comment)
    setComment("")
  }

  return (
    <Card sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Link href={blog.url} target="_blank" rel="noopener">
            {blog.url}
          </Link>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography>{blog.likes} likes</Typography>

            {user && (
              <Button variant="contained" onClick={() => likeBlog(blog)}>
                Like
              </Button>
            )}
          </Box>

          <Typography color="text.secondary">
            Added by {blog.user.name}
          </Typography>

          {user?.username === blog.user.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => deleteBlog(blog)}
            >
              Remove
            </Button>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleComment}
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            maxWidth: 600,
          }}
        >
          <TextField
            size="small"
            label="Add a comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            fullWidth
          />

          <Button type="submit" variant="contained">
            Add
          </Button>
        </Box>

        {comments.length === 0 ? (
          <Typography color="text.secondary">No comments yet.</Typography>
        ) : (
          <List dense>
            {comments.map((comment, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={comment} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default BlogView

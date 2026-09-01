import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material"

const BlogView = ({ blog, user, likeBlog, deleteBlog }) => {
  if (!blog) {
    return null
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
      </CardContent>
    </Card>
  )
}

export default BlogView

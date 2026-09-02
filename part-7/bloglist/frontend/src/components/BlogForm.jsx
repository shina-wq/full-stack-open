import { Box, Button, TextField, Typography } from "@mui/material"

import useField from "../hooks/useField"

const BlogForm = ({ createBlog }) => {
  const title = useField("text")
  const author = useField("text")
  const url = useField("url")

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <Box component="section" sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
        }}
      >
        <TextField label="Title" type={title.type} value={title.value} onChange={title.onChange} />
        <TextField label="Author" type={author.type} value={author.value} onChange={author.onChange} />
        <TextField label="URL" type={url.type} value={url.value} onChange={url.onChange} />

        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Box>
  )
}

export default BlogForm
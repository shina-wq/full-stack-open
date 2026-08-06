import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = event => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <Box component="section" sx={{ mt: 3}}>
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
        <TextField
          label="Author"
          value={author}
          onChange={({ target}) =>
            setAuthor(target.value)
          }
        />

        <TextField
          label="URL"
          value={url}
          onChange={({ target}) =>
            setUrl(target.value)
          }
        />

        <Button
          type="submit"
          variant="contained"
        >
          Create
        </Button>

      </Box>
    </Box>
  )
}

export default BlogForm
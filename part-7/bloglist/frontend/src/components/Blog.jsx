import { Link } from "react-router-dom"
import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

const Blog = ({ blog }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
        <CardContent>
          <Typography variant="h6">{blog.title}</Typography>

          <Typography variant="body2" color="text.secondary">
            {blog.author}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default Blog

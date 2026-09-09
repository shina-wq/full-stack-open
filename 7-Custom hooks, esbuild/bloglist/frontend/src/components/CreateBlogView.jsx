import BlogForm from "./BlogForm"

const CreateBlogView = ({ createBlog }) => {
  return (
    <>
      <h2>Create new blog</h2>

      <BlogForm createBlog={createBlog} />
    </>
  )
}

export default CreateBlogView

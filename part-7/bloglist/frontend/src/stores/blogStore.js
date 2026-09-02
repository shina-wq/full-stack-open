import { create } from "zustand"
import blogService from "../services/blogs"

const sortByLikes = (blogs) =>
  [...blogs].sort((a, b) => b.likes - a.likes)

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs: sortByLikes(blogs) })
  },

  createBlog: async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)

    set((state) => ({
      blogs: sortByLikes([...state.blogs, createdBlog]),
    }))

    return createdBlog
  },

  likeBlog: async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    set((state) => ({
      blogs: sortByLikes(
        state.blogs.map((blog) =>
          blog.id === returnedBlog.id ? returnedBlog : blog,
        ),
      ),
    }))

    return returnedBlog
  },

  deleteBlog: async (blog) => {
    await blogService.remove(blog.id)

    set((state) => ({
      blogs: state.blogs.filter((item) => item.id !== blog.id),
    }))
  },
}))

export default useBlogStore
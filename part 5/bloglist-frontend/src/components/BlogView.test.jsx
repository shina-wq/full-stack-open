import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { test, expect, vi } from "vitest"

import BlogView from "./BlogView"

const blog = {
  title: "React Testing",
  author: "Kent Dodds",
  url: "https://testing.com",
  likes: 10,
  user: {
    name: "Shina",
    username: "shina",
  },
}

test("unauthenticated users see blog information and likes, but no buttons", () => {
  render(
    <BlogView
      blog={blog}
      user={null}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  expect(screen.getByText(/React Testing/)).toBeInTheDocument()
  expect(screen.getByText(/Kent Dodds/)).toBeInTheDocument()
  expect(screen.getByText("https://testing.com")).toBeInTheDocument()
  expect(screen.getByText(/10 likes/i)).toBeInTheDocument()

  expect(
    screen.queryByRole("button", { name: /like/i })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole("button", { name: /remove/i })
  ).not.toBeInTheDocument()
})

test("authenticated users who are not the creator only see the like button", () => {
  render(
    <BlogView
      blog={blog}
      user={{ username: "someone-else" }}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  expect(
    screen.getByRole("button", { name: /like/i })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole("button", { name: /remove/i })
  ).not.toBeInTheDocument()
})

test("the blog creator sees both like and remove buttons", () => {
  render(
    <BlogView
      blog={blog}
      user={{ username: "shina" }}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  expect(
    screen.getByRole("button", { name: /like/i })
  ).toBeInTheDocument()

  expect(
    screen.getByRole("button", { name: /remove/i })
  ).toBeInTheDocument()
})

test("clicking the like button calls the event handler", async () => {
  const likeBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <BlogView
      blog={blog}
      user={{ username: "someone-else" }}
      likeBlog={likeBlog}
      deleteBlog={() => {}}
    />
  )

  await user.click(
    screen.getByRole("button", { name: /like/i })
  )

  expect(likeBlog).toHaveBeenCalledTimes(1)
})
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { test, expect, vi } from 'vitest'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'React Testing',
    author: 'Kent Dodds',
    url: 'https://testing.com',
    likes: 10,
    user: {
      name: 'Shina',
      username: 'shina'
    },
  }

  render(
    <Blog
      blog={blog}
      user={{ username: 'shina' }}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  expect(screen.getByText(/React Testing/)).toBeInTheDocument()
  expect(screen.getByText(/Kent Dodds/)).toBeInTheDocument()
  expect(screen.queryByText('https://testing.com')).not.toBeInTheDocument()
  expect(screen.queryByText(/10 likes/)).not.toBeInTheDocument()
})


test('shows url and likes after clicking the view button', async () => {
  const blog = {
    title: 'React Testing',
    author: 'Kent Dodds',
    url: 'https://testing.com',
    likes: 10,
    user: {
      name: 'Shina',
      username: 'shina'
    },
  }

  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={{ username: 'shina' }}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  const viewButton = screen.getByRole('button', { name: /view/i })
  await user.click(viewButton)

  expect(screen.getByText('https://testing.com')).toBeInTheDocument()
  expect(screen.getByText(/10 likes/i)).toBeInTheDocument()
})


test('calls the like event handler twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'React Testing',
    author: 'Kent Dodds',
    url: 'https://testing.com',
    likes: 10,
    user: {
      name: 'Shina',
      username: 'shina',
    },
  }

  const likeBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={{ username: 'shina' }}
      likeBlog={likeBlog}
      deleteBlog={() => {}}
    />
  )

  await user.click(screen.getByRole('button', { name: /view/i }))

  const likeButton = screen.getByRole('button', { name: /like/i })

  await user.click(likeButton)
  await user.click(likeButton)

  expect(likeBlog).toHaveBeenCalledTimes(2)
})
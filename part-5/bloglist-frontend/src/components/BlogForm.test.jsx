import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'Clean Code')
  await user.type(inputs[1], 'Robert C. Martin')
  await user.type(inputs[2], 'https://cleancode.com')

  await user.click(
    screen.getByRole('button', { name: /create/i })
  )

  expect(createBlog).toHaveBeenCalledTimes(1)

  expect(createBlog).toHaveBeenCalledWith({
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://cleancode.com',
  })
})
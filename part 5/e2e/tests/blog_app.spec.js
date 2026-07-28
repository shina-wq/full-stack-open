const { test, expect } = require("@playwright/test")

test.describe("Blog app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset")

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: "mluukkai",
        password: "salainen",
      },
    })

    await page.goto("http://localhost:5173")
  })

  test("Login form is shown", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /log into application/i })
    ).toBeVisible()

    await expect(page.getByLabel(/username/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()

    await expect(
      page.getByRole("button", { name: /login/i })
    ).toBeVisible()
  })


  test.describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel(/username/i).fill("mluukkai")
      await page.getByLabel(/password/i).fill("salainen")

      await page.getByRole("button", { name: /login/i }).click()

      await expect(
        page.getByText(/Test User logged in/i)
      ).toBeVisible()
    })

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel(/username/i).fill("mluukkai")
      await page.getByLabel(/password/i).fill("wrongpassword")

      await page.getByRole("button", { name: /login/i }).click()

      await expect(
        page.getByText(/wrong username or password/i)
      ).toBeVisible()
    })
  })


  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel(/username/i).fill("mluukkai")
      await page.getByLabel(/password/i).fill("salainen")

      await page.getByRole("button", { name: /login/i }).click()

      await expect(
        page.getByText(/Test User logged in/i)
      ).toBeVisible()
    })

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: /create new blog/i }).click()

      await page.getByLabel(/title/i).fill("Playwright Test Blog")
      await page.getByLabel(/author/i).fill("Shina")
      await page.getByLabel(/url/i).fill("https://example.com")

      await page.getByRole("button", { name: /^create$/i }).click()

      await expect(
        page.locator(".blog-summary").filter({
          hasText: "Playwright Test Blog Shina",
        })
      ).toBeVisible()
    })

    test("a blog can be liked", async ({ page }) => {
      // Create a blog first
      await page.getByRole("button", { name: /create new blog/i }).click()

      await page.getByLabel(/title/i).fill("Liked Blog")
      await page.getByLabel(/author/i).fill("Shina")
      await page.getByLabel(/url/i).fill("https://example.com")

      await page.getByRole("button", { name: /^create$/i }).click()

      // Open the blog details
      const blog = page.locator(".blog").filter({
        hasText: "Liked Blog Shina",
      })

      await blog.getByRole("button", { name: /view/i }).click()

      // Verify initial likes
      await expect(blog.getByText("0 likes")).toBeVisible()

      // Like the blog
      await blog.getByRole("button", { name: /like/i }).click()

      // Verify likes increased
      await expect(blog.getByText("1 likes")).toBeVisible()
    })

    test("a blog can be deleted by its creator", async ({ page }) => {
      await page.getByRole("button", { name: /create new blog/i }).click()

      await page.getByLabel(/title/i).fill("Delete Me")
      await page.getByLabel(/author/i).fill("Shina")
      await page.getByLabel(/url/i).fill("https://example.com")

      await page.getByRole("button", { name: /^create$/i }).click()

      const blog = page.locator(".blog").filter({
        hasText: "Delete Me",
      })

      await blog.getByRole("button", { name: /view/i }).click()

      page.on("dialog", dialog => dialog.accept())

      await blog.getByRole("button", { name: /remove/i }).click()

      await expect(blog).toHaveCount(0)
    })

    test("only the creator sees the remove button", async ({ page, request }) => {
      // Create blog as first user
      await page.getByRole("button", { name: /create new blog/i }).click()

      await page.getByLabel(/title/i).fill("Private Blog")
      await page.getByLabel(/author/i).fill("Shina")
      await page.getByLabel(/url/i).fill("https://example.com")

      await page.getByRole("button", { name: /^create$/i }).click()

      // Logout
      await page.getByRole("button", { name: /logout/i }).click()

      // Create second user
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Another User",
          username: "another",
          password: "secret",
        },
      })

      // Login as second user
      await page.getByLabel(/username/i).fill("another")
      await page.getByLabel(/password/i).fill("secret")
      await page.getByRole("button", { name: /login/i }).click()

      const blog = page.locator(".blog").filter({
        hasText: "Private Blog",
      })

      await blog.getByRole("button", { name: /view/i }).click()

      await expect(
        blog.getByRole("button", { name: /remove/i })
      ).toHaveCount(0)
    })

    test("blogs are ordered by likes", async ({ page }) => {
      const createBlog = async (title) => {
        await page.getByRole("button", { name: /create new blog/i }).click()

        await page.getByLabel(/title/i).fill(title)
        await page.getByLabel(/author/i).fill("Shina")
        await page.getByLabel(/url/i).fill("https://example.com")

        await page.getByRole("button", { name: /^create$/i }).click()

        // Wait until the blog appears before continuing
        await expect(
          page.locator(".blog").filter({ hasText: title })
        ).toBeVisible()
      }

      await createBlog("First")
      await createBlog("Second")
      await createBlog("Third")

      const likeBlog = async (title, likes) => {
        const blog = page.locator(".blog").filter({ hasText: title })

        await blog.getByRole("button", { name: /view/i }).click()

        for (let i = 0; i < likes; i++) {
          await blog.getByRole("button", { name: /like/i }).click()
          await expect(blog.getByText(`${i + 1} likes`)).toBeVisible()
        }
      }

      await likeBlog("First", 2)
      await likeBlog("Second", 5)
      await likeBlog("Third", 3)

      const blogs = page.locator(".blog")

      await expect(blogs.nth(0)).toContainText("Second")
      await expect(blogs.nth(1)).toContainText("Third")
      await expect(blogs.nth(2)).toContainText("First")
    })
  })
})
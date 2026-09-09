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

    const createBlog = async (page, title, author, url) => {
      await page.getByRole("link", { name: /create/i }).click()

      await page.getByLabel(/title/i).fill(title)
      await page.getByLabel(/author/i).fill(author)
      await page.getByLabel(/url/i).fill(url)

      await page.getByRole("button", { name: /^create$/i }).click()
    }

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "Playwright Test Blog",
        "Shina",
        "https://example.com"
      )

      await expect(
        page.getByRole("link", {
          name: /Playwright Test Blog Shina/i,
        })
      ).toBeVisible()
    })

    test("a blog can be liked", async ({ page }) => {
      await createBlog(
        page,
        "Liked Blog",
        "Shina",
        "https://example.com"
      )

      await page.getByRole("link", {
        name: /Liked Blog Shina/i,
      }).click()

      await expect(
        page.getByText("0 likes")
      ).toBeVisible()

      await page.getByRole("button", {
        name: /like/i,
      }).click()

      await expect(
        page.getByText("1 likes")
      ).toBeVisible()
    })

    test("a blog can be deleted by its creator", async ({ page }) => {
      await createBlog(
        page,
        "Delete Me",
        "Shina",
        "https://example.com"
      )

      await page.getByRole("link", {
        name: /Delete Me Shina/i,
      }).click()

      page.on("dialog", dialog => dialog.accept())

      await page.getByRole("button", {
        name: /remove/i,
      }).click()

      await expect(
        page.getByRole("link", {
          name: /Delete Me Shina/i,
        })
      ).toHaveCount(0)
    })
  })
})
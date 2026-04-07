import { test, expect } from "@playwright/test";

test.describe("Login page (mocked backend)", () => {
	test.beforeEach(async ({ page }) => {
		// 🔒 voorkom bestaande auth
		await page.addInitScript(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		// 🔧 mock checkSession
		await page.route("**/user/profile", async (route) => {
			await route.abort(); // force unauthenticated
		});

		await page.goto("/auth/login");

		// ✅ WACHT OP IETS STABIELS
		await expect(page.getByLabel(/email/i)).toBeVisible();
	});

	test("successful login redirects to modules page", async ({ page }) => {
		// 🔧 mock login
		await page.route("**/auth/login", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					user: {
						id: "1",
						email: "test@example.com",
						name: "Test User",
					},
				}),
			});
		});

		await page.getByLabel(/email/i).fill("test@example.com");
		await page.getByLabel(/password/i).fill("password");

		await page.getByRole("button", { name: /login/i }).click();

		// redirect heeft 500ms delay
		await page.waitForURL("**/modules");

		await expect(page).toHaveURL(/\/modules$/);
	});

	test("shows error on invalid credentials", async ({ page }) => {
		await page.route("**/auth/login", async (route) => {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({
					message: "Invalid credentials",
				}),
			});
		});

		await page.getByLabel(/email/i).fill("wrong@test.com");
		await page.getByLabel(/password/i).fill("wrong");

		await page.getByRole("button", { name: /login/i }).click();

		await expect(page.getByText(/invalid credentials/i)).toBeVisible();
	});
});

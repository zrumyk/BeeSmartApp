import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button', { hasText: /Login/i })).toBeVisible();
  });

  test('should login successfully as beekeeper', async ({ page }) => {
    // Мокаємо запит на логін
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { token: 'mock-token', user: { name: 'Ivan', role: 'beekeeper' } }
        }),
      });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@beekeeper.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');

    // Перевіряємо редирект на головну бджоляра
    await expect(page).toHaveURL(/.*beekeeper/);
  });
});

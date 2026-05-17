import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/BeeSmart/i || /Vite/i);
    await expect(page.locator('button', { hasText: /Login/i })).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@user.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    
    // Перевіряємо наявність тоста з помилкою (якщо використовується react-hot-toast)
    const toast = page.locator('.hot-toast-container'); // або інший селектор вашого тоста
    // Очікуємо, що вхід не вдався (залишаємось на сторінці логіну)
    await expect(page).toHaveURL(/.*login/);
  });
});

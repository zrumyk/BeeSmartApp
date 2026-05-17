import { test, expect } from '@playwright/test';

test.describe('Navigation and Access Control', () => {
  test('should redirect guest from protected route to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show correct layout for beekeeper (bottom navigation)', async ({ page }) => {
    // Цей тест імітує логін через localStorage, щоб не проходити форму щоразу
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'fake-token');
      window.localStorage.setItem('user_role', 'beekeeper');
    });
    
    await page.goto('/beekeeper');
    // Перевіряємо наявність нижньої навігації (вона специфічна для бджоляра)
    const bottomNav = page.locator('nav').filter({ has: page.locator('a[href="/beekeeper/scanner"]') });
    await expect(bottomNav).toBeVisible();
  });

  test('should show sidebar for admin', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'fake-token');
      window.localStorage.setItem('user_role', 'admin');
    });
    
    await page.goto('/admin');
    // Перевіряємо заголовок в бічному меню
    await expect(page.locator('text=BeeSmart Admin')).toBeVisible();
  });
});

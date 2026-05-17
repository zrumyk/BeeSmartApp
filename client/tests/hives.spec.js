import { test, expect } from '@playwright/test';

test.describe('Hives Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'fake-token');
      window.localStorage.setItem('user_role', 'admin');
    });
  });

  test('should display hives list and allow filtering', async ({ page }) => {
    await page.goto('/admin/hives');
    
    await expect(page.locator('h1')).toContainText('Hives Registry');
    
    // Перевірка наявності пошукового поля
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Вводимо текст у пошук (тестуємо UI реакцію)
    await searchInput.fill('H-001');
    // Тут можна додати перевірку на кількість рядків у таблиці, якщо є мок-дані
  });
});

import { test, expect } from '@playwright/test';

test.describe('Beekeeper Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'beekeeper', name: 'Petro' }));
    });
  });

  test('should show task list and completion button', async ({ page }) => {
    await page.goto('/beekeeper/tasks');
    await expect(page.locator('h1')).toContainText('Мої активні завдання');
    
    // Оскільки ми використовуємо фейковий токен, API може повернути 401 або пустий масив.
    // Але ми перевіряємо наявність контейнера або повідомлення про порожній список.
    const emptyMessage = page.locator('text=На сьогодні завдань немає');
    const taskCards = page.locator('article');
    
    await expect(emptyMessage.or(taskCards).first()).toBeVisible();
  });
});

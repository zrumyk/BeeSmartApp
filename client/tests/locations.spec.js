import { test, expect } from '@playwright/test';

test.describe('Locations Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'admin', name: 'Admin' }));
    });
  });

  test('should show locations page and create form', async ({ page }) => {
    await page.goto('/admin/locations');
    await expect(page.locator('h1')).toContainText('Locations & Apiaries');
    
    // Перевірка полів форми
    await expect(page.locator('input[placeholder="Main Field"]')).toBeVisible();
    await expect(page.locator('input[placeholder="50.4501"]')).toBeVisible();
    
    // Перевірка кнопки створення
    const submitBtn = page.locator('button', { hasText: 'Confirm Location' });
    await expect(submitBtn).toBeVisible();
  });
});

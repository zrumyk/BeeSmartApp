import { test, expect } from '@playwright/test';

test.describe('Admin Inspections', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'admin', name: 'Admin' }));
    });
  });

  test('should show inspections log page', async ({ page }) => {
    await page.goto('/admin/inspections');
    await expect(page.locator('h1')).toContainText('Inspections Log');
    
    // Очікуємо або повідомлення про відсутність даних, або список карток огляду
    const logContent = page.locator('text=No inspections found yet').or(page.locator('.rounded-2xl'));
    await expect(logContent.first()).toBeVisible();
  });
});

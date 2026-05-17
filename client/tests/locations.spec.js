import { test, expect } from '@playwright/test';

test.describe('Locations Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'admin', name: 'Admin' }));
    });
  });

  test('should create a new location successfully', async ({ page }) => {
    await page.route('**/api/locations', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: [] }) });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, data: { name: 'South Garden' } }) });
      }
    });

    await page.goto('/admin/locations');
    await page.fill('input[placeholder="Main Field"]', 'South Garden');
    await page.fill('input[placeholder="Kyiv region"]', 'Kyiv');
    await page.fill('input[placeholder="50.4501"]', '50.123');
    await page.fill('input[placeholder="30.5234"]', '30.456');
    
    await page.click('button:has-text("Confirm Location")');
    await expect(page.locator('input[placeholder="Main Field"]')).toHaveValue('');
  });
});

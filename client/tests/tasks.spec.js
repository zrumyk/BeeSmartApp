import { test, expect } from '@playwright/test';

test.describe('Beekeeper Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'beekeeper', name: 'Petro' }));
    });
  });

  test('should complete a task successfully', async ({ page }) => {
    await page.route('**/api/vet-tasks/my-tasks', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        success: true, data: [{ _id: 't1', task_type: 'Лікування', hive_id: { qr_code: 'H-001' }, due_date: new Date() }]
      })});
    });

    await page.route('**/api/vet-tasks/*/complete', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.goto('/beekeeper/tasks');
    await page.click('button:has-text("ВИКОНАНО")');
    await expect(page.locator('text=На сьогодні завдань немає')).toBeVisible();
  });
});

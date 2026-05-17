import { test, expect } from '@playwright/test';

test.describe('Beekeeper Tasks Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('beesmart_access_token', 'fake-token');
      window.localStorage.setItem('beesmart_auth', JSON.stringify({ role: 'beekeeper', name: 'Petro' }));
    });
  });

  test('should complete a task and update UI', async ({ page }) => {
    // Мокаємо список з одним завданням
    await page.route('**/api/vet-tasks/my-tasks', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true, 
          data: [{ _id: 't1', task_type: 'Check Varroa', hive_id: { qr_code: 'H-101' }, due_date: new Date() }]
        })
      });
    });

    // Мокаємо успішне завершення
    await page.route('**/api/vet-tasks/*/complete', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.goto('/beekeeper/tasks');
    await expect(page.locator('article')).toHaveCount(1);
    
    await page.click('button:has-text("ВИКОНАНО")');
    
    // Після кліку завдання має зникнути (фільтрація в стейті)
    await expect(page.locator('text=На сьогодні завдань немає')).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await page.route('**/api/vet-tasks/my-tasks', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) });
    });

    await page.goto('/beekeeper/tasks');
    await expect(page.locator('text=На сьогодні завдань немає')).toBeVisible();
  });
});

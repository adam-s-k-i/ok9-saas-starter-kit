import { test, expect } from '@playwright/test';

test('should load home page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/OK9 SaaS Starter Kit/);
});
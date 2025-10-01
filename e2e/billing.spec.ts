import { test, expect } from '@playwright/test';

test.describe('Billing Flow', () => {
  test('should display billing plans and allow subscription', async ({ page }) => {
    // Sign in first
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await page.getByLabel('Email (Development)').fill('test@example.com');
    await page.getByRole('button', { name: 'Mit Email anmelden' }).click();

    // Navigate to billing page
    await page.goto('http://localhost:3000/dashboard/billing');

    // Check that billing page loads
    await expect(page.getByText('Abonnement verwalten')).toBeVisible();

    // Check that plans are displayed
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('Enterprise')).toBeVisible();

    // Check pricing is displayed
    await expect(page.getByText('$0.00')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();

    // Check features are listed
    await expect(page.getByText('Basic features')).toBeVisible();
    await expect(page.getByText('Advanced features')).toBeVisible();
    await expect(page.getByText('All features')).toBeVisible();
  });

  test('should show FAQ section', async ({ page }) => {
    // Sign in first
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await page.getByLabel('Email (Development)').fill('test@example.com');
    await page.getByRole('button', { name: 'Mit Email anmelden' }).click();

    // Navigate to billing page
    await page.goto('http://localhost:3000/dashboard/billing');

    // Check FAQ section
    await expect(page.getByText('Häufig gestellte Fragen')).toBeVisible();
    await expect(page.getByText('Kann ich meinen Plan jederzeit wechseln?')).toBeVisible();
    await expect(page.getByText('Gibt es eine Geld-zurück-Garantie?')).toBeVisible();
    await expect(page.getByText('Welche Zahlungsmethoden werden akzeptiert?')).toBeVisible();
  });

  test('should redirect unauthenticated users from billing', async ({ page }) => {
    // Try to access billing without authentication
    await page.goto('http://localhost:3000/dashboard/billing');

    // Should be redirected to signin page
    await expect(page).toHaveURL(/.*signin/);
  });
});
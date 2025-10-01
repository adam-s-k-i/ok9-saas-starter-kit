import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to sign in with credentials', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000/');

    // Click the sign in button in the AuthDemo component
    await page.getByRole('button', { name: 'Anmelden' }).click();

    // Should be redirected to signin page
    await expect(page).toHaveURL(/.*signin/);

    // Fill in the email for development credentials
    await page.getByLabel('Email (Development)').fill('test@example.com');

    // Click sign in button
    await page.getByRole('button', { name: 'Mit Email anmelden' }).click();

    // Should be redirected back to home page
    await expect(page).toHaveURL('/');

    // Check that user is now signed in
    await expect(page.getByText('Angemeldet als: test@example.com')).toBeVisible();
  });

  test('should allow user to sign out', async ({ page }) => {
    // First sign in
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await page.getByLabel('Email (Development)').fill('test@example.com');
    await page.getByRole('button', { name: 'Mit Email anmelden' }).click();

    // Verify signed in
    await expect(page.getByText('Angemeldet als: test@example.com')).toBeVisible();

    // Click sign out button
    await page.getByRole('button', { name: 'Abmelden' }).click();

    // Should show not signed in state
    await expect(page.getByText('Nicht angemeldet')).toBeVisible();
  });

  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('http://localhost:3000/dashboard');

    // Should be redirected to signin page
    await expect(page).toHaveURL(/.*signin/);
  });

  test('should allow authenticated users to access dashboard', async ({ page }) => {
    // Sign in first
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await page.getByLabel('Email (Development)').fill('test@example.com');
    await page.getByRole('button', { name: 'Mit Email anmelden' }).click();

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Should be able to access dashboard
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});
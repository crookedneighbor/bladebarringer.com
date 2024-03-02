import { expect, test } from '@playwright/test';

test('index page has expected snake the cat image', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('snake-the-cat')).toBeVisible();
});

import { test, expect } from '@playwright/test';


test.describe('Vanilla Scroll Sync', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

	});

	test('should test stuff', async ({ page }) => {

	});
});

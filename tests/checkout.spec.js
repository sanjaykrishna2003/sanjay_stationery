const { test, expect } = require('@playwright/test');

test('successful checkout produces a confirmation', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('add-pen').click();
  await expect(page.getByTestId('cart-item-pen')).toBeVisible();
  await expect(page.getByTestId('order-total')).toHaveText('₹20.00');

  await page.getByTestId('customer-name').fill('Asha Rao');
  await page.getByTestId('place-order').click();

  const confirmation = page.getByTestId('order-confirmation');
  await expect(confirmation).toHaveCount(1);
  await expect(confirmation).toBeVisible();
  await expect(page.getByTestId('confirm-name')).toHaveText('Asha Rao');
  await expect(page.getByTestId('confirm-ref')).toHaveText(/^SS-\d{5}$/);
  await expect(page.getByTestId('confirm-total')).toHaveText('₹20.00');
  await expect(page.getByTestId('place-order')).toBeDisabled();
});

test('missing name blocks checkout', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('add-notebook').click();
  await expect(page.getByTestId('cart-item-notebook')).toBeVisible();
  await expect(page.getByTestId('order-total')).toHaveText('₹60.00');

  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('name-error')).toBeVisible();
  await expect(page.getByTestId('name-error')).toHaveText('Please enter your name to place the order.');
  await expect(page.getByTestId('customer-name')).toBeFocused();
  await expect(page.getByTestId('order-confirmation')).toHaveCount(0);
  await expect(page.getByTestId('cart-item-notebook')).toBeVisible();
  await expect(page.getByTestId('qty-notebook')).toHaveValue('1');
  await expect(page.getByTestId('order-total')).toHaveText('₹60.00');
});

test('quantity change updates the exact total', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('add-pen').click();
  await expect(page.getByTestId('line-total-pen')).toHaveText('₹20.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹20.00');

  await page.getByTestId('add-notebook').click();
  await expect(page.getByTestId('line-total-notebook')).toHaveText('₹60.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹80.00');

  await page.getByTestId('increase-pen').click();
  await expect(page.getByTestId('qty-pen')).toHaveValue('2');
  await expect(page.getByTestId('line-total-pen')).toHaveText('₹40.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹100.00');

  await page.getByTestId('qty-notebook').fill('20');
  await expect(page.getByTestId('line-total-notebook')).toHaveText('₹1,200.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹1,240.00');
});

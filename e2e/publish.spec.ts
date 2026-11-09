import { expect, test } from '@playwright/test'
import { login } from './helpers'

test('publicar exige sesión y valida el formulario', async ({ page }) => {
  await page.goto('/sell')
  await expect(page).toHaveURL(/\/login/)
  await login(page, 'ana@loop.test')
  await page.goto('/sell')
  await page.getByLabel('Título').fill('abc')
  await page.getByRole('button', { name: /Siguiente|Continuar/ }).click()
  await expect(page.getByText(/al menos 5|mínimo/i).first()).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('buscar un artículo y abrir su ficha', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder(/Busca bicicletas/).fill('portatil')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search/)
  await page
    .getByRole('link', { name: /Portátil 14 pulgadas/ })
    .first()
    .click()
  await expect(page.getByRole('heading', { name: /Portátil 14 pulgadas/ })).toBeVisible()
})

test('acceso con credenciales erróneas muestra un error genérico', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('ana@loop.test')
  await page.getByLabel('Contraseña').fill('incorrecta-123456')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Email o contraseña incorrectos').first()).toBeVisible()
})

import { expect, test } from '@playwright/test'
import { login } from './helpers'

// Recorrido crítico: el comprador oferta y el vendedor acepta.
// Requiere base recién sembrada (`bun run db:reset`).
test('comprador oferta y vendedor acepta', async ({ browser }) => {
  const buyer = await (await browser.newContext()).newPage()
  await login(buyer, 'ana@loop.test')
  await buyer.goto('/search?q=Port%C3%A1til')
  await buyer
    .getByRole('link', { name: /Portátil 14 pulgadas/ })
    .first()
    .click()
  await buyer
    .getByRole('link', { name: /Contactar con/ })
    .first()
    .click()
  await buyer.getByRole('button', { name: 'Hacer una oferta' }).click()
  await buyer.getByLabel('Importe en euros').fill('380')
  await buyer.getByRole('button', { name: 'Enviar oferta' }).click()
  await expect(buyer.getByText('Oferta enviada')).toBeVisible()

  const seller = await (await browser.newContext()).newPage()
  await login(seller, 'carlos@loop.test')
  await seller.goto('/messages')
  await seller
    .getByRole('link', { name: /Portátil 14 pulgadas/ })
    .first()
    .click()
  await seller.getByRole('button', { name: /Aceptar/ }).click()
  await expect(seller.getByText(/reservado/i).first()).toBeVisible()
})

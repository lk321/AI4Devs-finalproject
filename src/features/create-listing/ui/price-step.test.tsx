import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form } from '@/shared/ui/form'
import type { ListingDraft } from '@/entities/listing'
import { PriceStep } from './price-step'

function Harness() {
  const form = useForm<ListingDraft>({ defaultValues: { priceCents: undefined, city: '' } })
  return (
    <Form {...form}>
      <PriceStep form={form} categories={[]} />
    </Form>
  )
}

describe('el paso de precio es accesible', () => {
  it('asocia la etiqueta con el campo de precio', () => {
    render(<Harness />)

    expect(screen.getByLabelText('Precio')).toBeInTheDocument()
  })
})

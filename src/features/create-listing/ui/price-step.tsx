'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { CITIES, type CategoryTree, type ListingDraft } from '@/entities/listing'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { ListingPreview } from './listing-preview'

type Props = { form: UseFormReturn<ListingDraft>; categories: CategoryTree[] }

function PriceInput({
  value,
  onBlur,
  onChange,
}: {
  value: number | undefined
  onBlur: () => void
  onChange: (cents: number | undefined) => void
}) {
  const [text, setText] = useState(value === undefined ? '' : (value / 100).toFixed(2))

  return (
    <Input
      type="number"
      inputMode="decimal"
      min={0.01}
      step={0.01}
      placeholder="180"
      value={text}
      onBlur={onBlur}
      onChange={(event) => {
        setText(event.target.value)
        const euros = Number.parseFloat(event.target.value)
        onChange(Number.isNaN(euros) ? undefined : Math.round(euros * 100))
      }}
    />
  )
}

export function PriceStep({ form, categories }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="priceCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <PriceInput value={field.value} onBlur={field.onBlur} onChange={field.onChange} />
              </FormControl>
              <FormDescription>En euros, sin gastos de envío.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elige tu ciudad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Sólo mostramos la ciudad, nunca tu dirección.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ListingPreview draft={form.watch()} categories={categories} />
    </div>
  )
}

'use client'

import type { UseFormReturn } from 'react-hook-form'
import { CONDITION_LABELS, LISTING_CONDITIONS, type CategoryTree } from '@/entities/listing'
import type { ListingDraft } from '@/entities/listing'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'

type Props = { form: UseFormReturn<ListingDraft>; categories: CategoryTree[] }

export function ItemStep({ form, categories }: Props) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Bicicleta de montaña talla M" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                rows={6}
                placeholder="Cuenta el uso que le has dado, qué incluye y cualquier detalle o desperfecto."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categorySlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elige una categoría" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectGroup key={category.id}>
                    <SelectLabel>{category.name}</SelectLabel>
                    {category.children.map((child) => (
                      <SelectItem key={child.id} value={child.slug}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado de conservación</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-2 sm:grid-cols-2"
              >
                {LISTING_CONDITIONS.map((condition) => (
                  <div
                    key={condition}
                    className="has-aria-checked:border-primary has-aria-checked:bg-primary/5 flex items-center gap-3 rounded-lg border p-3"
                  >
                    <RadioGroupItem value={condition} id={`condition-${condition}`} />
                    <Label
                      htmlFor={`condition-${condition}`}
                      className="cursor-pointer font-normal"
                    >
                      {CONDITION_LABELS[condition]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

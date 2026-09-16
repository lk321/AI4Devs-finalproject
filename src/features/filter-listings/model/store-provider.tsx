'use client'

import { useState, type ReactNode } from 'react'
import type { ListingSearchParams } from '@/entities/listing'
import { createFilterStore, toFilterValues } from './store'
import { FilterStoreContext } from './context'
import { FilterUrlSync } from './filter-url-sync'

export function FilterStoreProvider({
  params,
  children,
}: {
  params: ListingSearchParams
  children: ReactNode
}) {
  const [store] = useState(() => createFilterStore(toFilterValues(params)))

  return (
    <FilterStoreContext.Provider value={store}>
      <FilterUrlSync />
      {children}
    </FilterStoreContext.Provider>
  )
}

'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
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
  const term = useSearchParams().get('q') ?? ''
  const lastTerm = useRef(term)

  useEffect(() => {
    if (lastTerm.current === term) return
    lastTerm.current = term
    store.getState().actions.setValue('q', term)
  }, [store, term])

  return (
    <FilterStoreContext.Provider value={store}>
      <FilterUrlSync />
      {children}
    </FilterStoreContext.Provider>
  )
}

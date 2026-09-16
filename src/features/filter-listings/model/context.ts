'use client'

import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import type { FilterState, FilterStore, FilterValues } from './store'

export const FilterStoreContext = createContext<FilterStore | null>(null)

export function useFilterStore<T>(selector: (state: FilterState) => T): T {
  const store = useContext(FilterStoreContext)
  if (!store) throw new Error('FilterStoreProvider ausente')
  return useStore(store, selector)
}

export function useFilterValue<K extends keyof FilterValues>(key: K) {
  return useFilterStore((state) => state.values[key])
}

export function useFilterActions() {
  return useFilterStore((state) => state.actions)
}

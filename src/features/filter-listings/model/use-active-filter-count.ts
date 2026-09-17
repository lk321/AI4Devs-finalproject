'use client'

import { useFilterStore } from './context'
import { activeFilterCount } from './store'

export function useActiveFilterCount() {
  return useFilterStore((state) => activeFilterCount(state.values))
}

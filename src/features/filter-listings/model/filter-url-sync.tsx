'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toQueryString } from '@/entities/listing'
import { toFilterParams } from './store'
import { useFilterStore } from './context'

const DEBOUNCE_MS = 600

export function FilterUrlSync() {
  const router = useRouter()
  const values = useFilterStore((state) => state.values)
  const previous = useRef(values)

  useEffect(() => {
    const prev = previous.current
    if (prev === values) return
    previous.current = values

    const commit = () => {
      const query = toQueryString({ ...toFilterParams(values), page: 1 })
      router.replace(query ? `/search?${query}` : '/search', { scroll: false })
    }

    if (prev.min === values.min && prev.max === values.max) {
      commit()
      return
    }

    const timer = setTimeout(commit, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [values, router])

  return null
}

'use client'

import { LibraryToolbar } from './library-toolbar'
import type { LibraryFilters } from '@/lib/library/query'

type LibraryControlsProps = {
  filters: LibraryFilters
  genres: string[]
  modes?: string[]
}

export function LibraryControls({
  filters,
  genres,
  modes = [],
}: LibraryControlsProps) {
  return <LibraryToolbar filters={filters} genres={genres} modes={modes} />
}
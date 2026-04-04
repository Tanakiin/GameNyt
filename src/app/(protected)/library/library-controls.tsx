'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LibraryFilters } from '@/lib/library/query'

type LibraryControlsProps = {
  filters: LibraryFilters
  genres: string[]
}

export function LibraryControls({ filters, genres }: LibraryControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  function clearFilters() {
    router.push(pathname)
  }

  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Library controls</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Search, sort, filter, and change layout.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Search</label>
          <input
            value={filters.search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search by title..."
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Layout</label>
          <select
            value={filters.layout}
            onChange={(e) => updateParam('layout', e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Sort by</label>
          <select
            value={filters.sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          >
            <option value="recent">Recently added</option>
            <option value="title">Title</option>
            <option value="playtime">Playtime</option>
            <option value="rating">Rating</option>
            <option value="lastPlayed">Last played</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateParam('status', e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          >
            <option value="all">All statuses</option>
            <option value="unplayed">Unplayed</option>
            <option value="playing">Playing</option>
            <option value="finished">Finished</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Source</label>
          <select
            value={filters.source}
            onChange={(e) => updateParam('source', e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          >
            <option value="all">All sources</option>
            <option value="steam">Steam</option>
            <option value="epic">Epic</option>
            <option value="manual">Manual</option>
            <option value="console">Console</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => updateParam('genre', e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-700 bg-black px-3 text-sm text-white outline-none"
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}
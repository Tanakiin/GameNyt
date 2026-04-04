'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Grid3X3, LayoutList, Search, SlidersHorizontal } from 'lucide-react'
import type { LibraryFilters } from '@/lib/library/query'

type LibraryToolbarProps = {
  filters: LibraryFilters
  genres: string[]
}

export function LibraryToolbar({ filters, genres }: LibraryToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [showSortPanel, setShowSortPanel] = useState(false)
  const [showLayoutPanel, setShowLayoutPanel] = useState(false)

  const sortPanelRef = useRef<HTMLDivElement | null>(null)
  const layoutPanelRef = useRef<HTMLDivElement | null>(null)

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (
        sortPanelRef.current &&
        !sortPanelRef.current.contains(target)
      ) {
        setShowSortPanel(false)
      }

      if (
        layoutPanelRef.current &&
        !layoutPanelRef.current.contains(target)
      ) {
        setShowLayoutPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(currentParams.toString())

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  function clearFilters() {
    const params = new URLSearchParams(currentParams.toString())
    params.delete('status')
    params.delete('source')
    params.delete('genre')
    params.delete('sort')
    params.delete('direction')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            value={filters.search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search your library..."
            className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 pl-10 pr-3 text-sm text-white outline-none transition focus:border-neutral-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative" ref={sortPanelRef}>
            <button
              type="button"
              onClick={() => {
                setShowSortPanel((v) => !v)
                setShowLayoutPanel(false)
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white hover:border-neutral-600"
            >
              <SlidersHorizontal size={16} />
              Sort & Filter
            </button>

            {showSortPanel ? (
              <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Sort by
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) => updateParam('sort', e.target.value)}
                      className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                    >
                      <option value="recent">Recently added</option>
                      <option value="title">Title</option>
                      <option value="playtime">Playtime</option>
                      <option value="rating">Rating</option>
                      <option value="lastPlayed">Last played</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Direction
                    </label>
                    <select
                      value={filters.direction}
                      onChange={(e) => updateParam('direction', e.target.value)}
                      className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => updateParam('status', e.target.value)}
                      className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                    >
                      <option value="all">All statuses</option>
                      <option value="unplayed">Unplayed</option>
                      <option value="playing">Playing</option>
                      <option value="finished">Finished</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Source
                    </label>
                    <select
                      value={filters.source}
                      onChange={(e) => updateParam('source', e.target.value)}
                      className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                    >
                      <option value="all">All sources</option>
                      <option value="steam">Steam</option>
                      <option value="epic">Epic</option>
                      <option value="manual">Manual</option>
                      <option value="console">Console</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Genre
                    </label>
                    <select
                      value={filters.genre}
                      onChange={(e) => updateParam('genre', e.target.value)}
                      className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                    >
                      <option value="">All genres</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white hover:border-neutral-600"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={layoutPanelRef}>
            <button
              type="button"
              onClick={() => {
                setShowLayoutPanel((v) => !v)
                setShowSortPanel(false)
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-white hover:border-neutral-600"
            >
              {filters.layout === 'grid' ? <Grid3X3 size={16} /> : <LayoutList size={16} />}
              Layout
            </button>

            {showLayoutPanel ? (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                      View
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateParam('layout', 'grid')}
                        className={`rounded-xl px-3 py-2 text-sm ${
                          filters.layout === 'grid'
                            ? 'bg-white text-black'
                            : 'border border-neutral-800 bg-neutral-900 text-white'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => updateParam('layout', 'list')}
                        className={`rounded-xl px-3 py-2 text-sm ${
                          filters.layout === 'list'
                            ? 'bg-white text-black'
                            : 'border border-neutral-800 bg-neutral-900 text-white'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>

                  {filters.layout === 'grid' ? (
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Columns
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['2', '3', '4', '5'].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => updateParam('columns', count)}
                            className={`rounded-xl px-3 py-2 text-sm ${
                              filters.columns === count
                                ? 'bg-white text-black'
                                : 'border border-neutral-800 bg-neutral-900 text-white'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
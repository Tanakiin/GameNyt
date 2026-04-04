'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LibraryFilters } from '@/lib/library/query'

type Props = {
  filters: LibraryFilters
  genres: string[]
}

export function LibraryToolbar({ filters, genres }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [showSort, setShowSort] = useState(false)
  const [showLayout, setShowLayout] = useState(false)

  const sortRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false)
      }
      if (layoutRef.current && !layoutRef.current.contains(e.target as Node)) {
        setShowLayout(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {/* SORT + FILTER */}
      <div ref={sortRef} className="relative">
        <button
          onClick={() => setShowSort((prev) => !prev)}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-white hover:border-neutral-600"
        >
          Sort & Filter
        </button>

        {showSort && (
          <div className="absolute z-50 mt-2 w-72 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl">
            <div className="space-y-3 text-sm">
              {/* SEARCH */}
              <input
                defaultValue={filters.search}
                placeholder="Search"
                onChange={(e) => updateParam('search', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white outline-none"
              />

              {/* SORT */}
              <select
                value={filters.sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="recent">Recently added</option>
                <option value="title">Title</option>
                <option value="playtime">Playtime</option>
                <option value="rating">Rating</option>
                <option value="lastPlayed">Last played</option>
              </select>

              {/* DIRECTION */}
              <select
                value={filters.direction}
                onChange={(e) => updateParam('direction', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

              {/* STATUS */}
              <select
                value={filters.status}
                onChange={(e) => updateParam('status', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="all">All status</option>
                <option value="backlog">Backlog</option>
                <option value="playing">In progress</option>
                <option value="finished">Finished</option>
                <option value="dropped">Dropped</option>
              </select>

              {/* PLAY TIER */}
              <select
                value={filters.tier}
                onChange={(e) => updateParam('tier', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="all">All play levels</option>
                <option value="untouched">Untouched</option>
                <option value="tried">Tried</option>
                <option value="played">Played</option>
                <option value="heavy">Heavily played</option>
              </select>

              {/* GENRE */}
              <select
                value={filters.genre}
                onChange={(e) => updateParam('genre', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="">All genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              {/* SOURCE */}
              <select
                value={filters.source}
                onChange={(e) => updateParam('source', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white"
              >
                <option value="all">All sources</option>
                <option value="steam">Steam</option>
                <option value="manual">Manual</option>
                <option value="epic">Epic</option>
                <option value="console">Console</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* LAYOUT */}
      <div ref={layoutRef} className="relative">
        <button
          onClick={() => setShowLayout((prev) => !prev)}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-white hover:border-neutral-600"
        >
          Layout
        </button>

        {showLayout && (
          <div className="absolute z-50 mt-2 w-48 rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-xl">
            <div className="space-y-2 text-sm">
              <select
                value={filters.layout}
                onChange={(e) => updateParam('layout', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-white"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>

              <select
                value={filters.columns}
                onChange={(e) => updateParam('columns', e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-white"
              >
                <option value="2">2 columns</option>
                <option value="3">3 columns</option>
                <option value="4">4 columns</option>
                <option value="5">5 columns</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
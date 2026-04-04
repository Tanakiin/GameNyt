'use client'

import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LibraryFilters } from '@/lib/library/query'

type LibraryToolbarProps = {
  filters: LibraryFilters
  genres: string[]
}

export function LibraryToolbar({ filters, genres }: LibraryToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  )

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())

    if (!value || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }

    if (key !== 'layout' && key !== 'columns') {
      if (!next.get('sort')) next.set('sort', filters.sort)
      if (!next.get('direction')) next.set('direction', filters.direction)
    }

    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`)
    })
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="grid gap-3 xl:grid-cols-6">
        <input
          defaultValue={filters.search}
          placeholder="Search title"
          onChange={(event) => updateParam('search', event.target.value.trim())}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none placeholder:text-neutral-500"
        />

        <select
          value={filters.status}
          onChange={(event) => updateParam('status', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="backlog">Backlog</option>
          <option value="playing">In progress</option>
          <option value="finished">Finished</option>
          <option value="dropped">Dropped</option>
        </select>

        <select
          value={filters.tier}
          onChange={(event) => updateParam('tier', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="all">All play tiers</option>
          <option value="untouched">Untouched</option>
          <option value="tried">Tried</option>
          <option value="played">Played</option>
          <option value="heavy">Heavily played</option>
        </select>

        <select
          value={filters.genre}
          onChange={(event) => updateParam('genre', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={filters.source}
          onChange={(event) => updateParam('source', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="all">All sources</option>
          <option value="steam">Steam</option>
          <option value="epic">Epic</option>
          <option value="manual">Manual</option>
          <option value="console">Console</option>
          <option value="other">Other</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={filters.sort}
            onChange={(event) => updateParam('sort', event.target.value)}
            className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
          >
            <option value="recent">Recently added</option>
            <option value="title">Title</option>
            <option value="playtime">Playtime</option>
            <option value="rating">Rating</option>
            <option value="lastPlayed">Last played</option>
          </select>

          <select
            value={filters.direction}
            onChange={(event) => updateParam('direction', event.target.value)}
            className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <select
          value={filters.layout}
          onChange={(event) => updateParam('layout', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>

        <select
          value={filters.columns}
          onChange={(event) => updateParam('columns', event.target.value)}
          className="h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="2">2 columns</option>
          <option value="3">3 columns</option>
          <option value="4">4 columns</option>
          <option value="5">5 columns</option>
        </select>
      </div>
    </div>
  )
}
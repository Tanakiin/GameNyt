'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

  function handleSearchSubmit(formData: FormData) {
    const value = String(formData.get('search') ?? '').trim()
    updateParam('search', value)
  }

  function clearFilters() {
    router.push(pathname)
  }

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <form
        action={handleSearchSubmit}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <Input
          name="search"
          defaultValue={filters.search}
          placeholder="Search by title..."
          className="flex-1"
        />
        <Button
          type="submit"
          className="!bg-white !text-black hover:!bg-neutral-200"
        >
          Search
        </Button>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <select
          value={filters.layout}
          onChange={(e) => updateParam('layout', e.target.value)}
          className="h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="grid">Grid view</option>
          <option value="list">List view</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="recent">Recently added</option>
          <option value="title">Title</option>
          <option value="playtime">Playtime</option>
          <option value="rating">Personal rating</option>
          <option value="lastPlayed">Last played</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => updateParam('status', e.target.value)}
          className="h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="unplayed">Unplayed</option>
          <option value="playing">Playing</option>
          <option value="finished">Finished</option>
          <option value="dropped">Dropped</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) => updateParam('source', e.target.value)}
          className="h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="all">All sources</option>
          <option value="steam">Steam</option>
          <option value="epic">Epic</option>
          <option value="manual">Manual</option>
          <option value="console">Console</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.genre}
          onChange={(e) => updateParam('genre', e.target.value)}
          className="h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none"
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
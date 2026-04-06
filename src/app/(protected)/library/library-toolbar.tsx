'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal, LayoutGrid, Rows3, Grid2x2, Grid3x3 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LibraryFilters } from '@/lib/library/query'

type Props = {
  filters: LibraryFilters
  genres: string[]
}

type FilterChip = {
  key: string
  label: string
  value: string
}

const statusOptions = [
  { value: 'all', label: 'All status' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'playing', label: 'In progress' },
  { value: 'finished', label: 'Finished' },
  { value: 'dropped', label: 'Dropped' },
]

const tierOptions = [
  { value: 'all', label: 'All play levels' },
  { value: 'untouched', label: 'Untouched' },
  { value: 'tried', label: 'Tried' },
  { value: 'played', label: 'Played' },
  { value: 'heavy', label: 'Heavily played' },
]

const sourceOptions = [
  { value: 'all', label: 'All sources' },
  { value: 'steam', label: 'Steam' },
  { value: 'manual', label: 'Manual' },
  { value: 'epic', label: 'Epic' },
  { value: 'console', label: 'Console' },
  { value: 'other', label: 'Other' },
]

const sortOptions = [
  { value: 'lastPlayed', label: 'Last played' },
  { value: 'recent', label: 'Recently added' },
  { value: 'title', label: 'Title' },
  { value: 'playtime', label: 'Playtime' },
  { value: 'rating', label: 'Rating' },
]

const directionOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
]

const columnOptions = [
  { value: '2', label: '2', icon: Grid2x2 },
  { value: '3', label: '3', icon: Grid2x2 },
  { value: '4', label: '4', icon: Grid3x3 },
  { value: '5', label: '5', icon: Grid3x3 },
]

export function LibraryToolbar({ filters, genres }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showLayoutPanel, setShowLayoutPanel] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search)

  const filterRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchValue(filters.search)
  }, [filters.search])

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  function removeParam(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }

  function clearAllFilters() {
    const params = new URLSearchParams(searchParams.toString())

    ;['status', 'source', 'genre', 'tier', 'search'].forEach((key) => {
      params.delete(key)
    })

    router.replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get('search') ?? ''
      const nextSearch = searchValue.trim()

      if (currentSearch === nextSearch) {
        return
      }

      const params = new URLSearchParams(searchParams.toString())

      if (!nextSearch) {
        params.delete('search')
      } else {
        params.set('search', nextSearch)
      }

      router.replace(`${pathname}?${params.toString()}`)
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchValue, pathname, router, searchParams])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPanel(false)
      }

      if (layoutRef.current && !layoutRef.current.contains(event.target as Node)) {
        setShowLayoutPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = []

    if (filters.search) {
      chips.push({ key: 'search', label: 'Search', value: filters.search })
    }

    if (filters.status !== 'all') {
      chips.push({
        key: 'status',
        label: 'Status',
        value: statusOptions.find((item) => item.value === filters.status)?.label ?? filters.status,
      })
    }

    if (filters.tier !== 'all') {
      chips.push({
        key: 'tier',
        label: 'Play level',
        value: tierOptions.find((item) => item.value === filters.tier)?.label ?? filters.tier,
      })
    }

    if (filters.genre) {
      chips.push({ key: 'genre', label: 'Genre', value: filters.genre })
    }

    if (filters.source !== 'all') {
      chips.push({
        key: 'source',
        label: 'Source',
        value: sourceOptions.find((item) => item.value === filters.source)?.label ?? filters.source,
      })
    }

    return chips
  }, [filters])

  const activeFilterCount = activeChips.filter((chip) => chip.key !== 'search').length

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search your library"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none ring-0 transition placeholder:text-neutral-500 hover:border-white/15 focus:border-cyan-500/30 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFilterPanel((prev) => !prev)
                setShowLayoutPanel(false)
              }}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-neutral-200 transition hover:border-white/15 hover:bg-white/[0.07]"
              aria-label="Open sort and filter panel"
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[11px] font-semibold text-slate-950">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            {showFilterPanel ? (
              <div className="absolute right-0 z-50 mt-3 w-[360px] rounded-3xl border border-white/10 bg-[#0b1016]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur xl:w-[420px]">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                      Sort & Filter
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Shape your library view
                    </h3>
                  </div>

                  {activeChips.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-4">
                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                      Ordering
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <LabeledSelect
                        label="Sort by"
                        value={filters.sort}
                        onChange={(value) => updateParam('sort', value)}
                        options={sortOptions}
                      />
                      <LabeledSelect
                        label="Direction"
                        value={filters.direction}
                        onChange={(value) => updateParam('direction', value)}
                        options={directionOptions}
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                      Play state
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <LabeledSelect
                        label="Manual status"
                        value={filters.status}
                        onChange={(value) => updateParam('status', value)}
                        options={statusOptions}
                      />
                      <LabeledSelect
                        label="Play level"
                        value={filters.tier}
                        onChange={(value) => updateParam('tier', value)}
                        options={tierOptions}
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                      Metadata
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <LabeledSelect
                        label="Genre"
                        value={filters.genre}
                        onChange={(value) => updateParam('genre', value)}
                        options={[
                          { value: '', label: 'All genres' },
                          ...genres.map((genre) => ({ value: genre, label: genre })),
                        ]}
                      />
                      <LabeledSelect
                        label="Source"
                        value={filters.source}
                        onChange={(value) => updateParam('source', value)}
                        options={sourceOptions}
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        Active filters
                      </p>
                      <p className="text-xs text-neutral-500">
                        {activeChips.length === 0 ? 'None applied' : `${activeChips.length} active`}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeChips.length === 0 ? (
                        <span className="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-xs text-neutral-500">
                          Add filters to narrow your library
                        </span>
                      ) : (
                        activeChips.map((chip) => (
                          <button
                            key={`${chip.key}-${chip.value}`}
                            type="button"
                            onClick={() => removeParam(chip.key)}
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/15"
                          >
                            <span className="text-cyan-300/80">{chip.label}:</span>
                            <span>{chip.value}</span>
                            <span className="text-cyan-300/70">×</span>
                          </button>
                        ))
                      )}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}
          </div>

          <div ref={layoutRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLayoutPanel((prev) => !prev)
                setShowFilterPanel(false)
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-neutral-200 transition hover:border-white/15 hover:bg-white/[0.07]"
              aria-label="Open layout panel"
            >
              {filters.layout === 'list' ? <Rows3 size={18} /> : <LayoutGrid size={18} />}
            </button>

            {showLayoutPanel ? (
              <div className="absolute right-0 z-50 mt-3 w-[280px] rounded-3xl border border-white/10 bg-[#0b1016]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                    Layout
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Tune the view
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                      View mode
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateParam('layout', 'grid')}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          filters.layout === 'grid'
                            ? 'border-cyan-500/25 bg-cyan-500/12 text-cyan-200'
                            : 'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <LayoutGrid size={16} />
                          <span>Grid</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateParam('layout', 'list')}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          filters.layout === 'list'
                            ? 'border-cyan-500/25 bg-cyan-500/12 text-cyan-200'
                            : 'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Rows3 size={16} />
                          <span>List</span>
                        </div>
                      </button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                      Grid density
                    </p>

                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {columnOptions.map((option) => {
                        const Icon = option.icon
                        const active = filters.columns === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateParam('columns', option.value)}
                            className={`rounded-2xl border px-2 py-3 text-sm font-medium transition ${
                              active
                                ? 'border-cyan-500/25 bg-cyan-500/12 text-cyan-200'
                                : 'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/15 hover:text-white'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <Icon size={15} />
                              <span>{option.label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}-bar`}
              type="button"
              onClick={() => removeParam(chip.key)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
            >
              <span className="text-neutral-500">{chip.label}</span>
              <span>{chip.value}</span>
              <span className="text-neutral-500">×</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-white/10 bg-neutral-950/70 px-3 text-sm text-white outline-none transition hover:border-white/15 focus:border-cyan-500/30"
      >
        {options.map((option) => (
          <option key={`${label}-${option.value || 'empty'}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
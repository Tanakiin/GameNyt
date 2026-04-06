'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import {
  Check,
  ChevronDown,
  LayoutGrid,
  Rows3,
  Search,
  SlidersHorizontal,
  Grid2x2,
  Grid3x3,
  X,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LibraryFilters } from '@/lib/library/query'

type Props = {
  filters: LibraryFilters
  genres: string[]
  modes: string[]
}

type FilterChip = {
  key: 'search' | 'status' | 'tier' | 'source' | 'genre' | 'mode'
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

export function LibraryToolbar({ filters, genres, modes }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showLayoutPanel, setShowLayoutPanel] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search)

  const [draftSort, setDraftSort] = useState(filters.sort)
  const [draftDirection, setDraftDirection] = useState(filters.direction)
  const [draftStatus, setDraftStatus] = useState(filters.status)
  const [draftTier, setDraftTier] = useState(filters.tier)
  const [draftGenres, setDraftGenres] = useState<string[]>(filters.genres)
  const [draftSources, setDraftSources] = useState<string[]>(filters.sources)
  const [draftModes, setDraftModes] = useState<string[]>(filters.modes)

  const [draftLayout, setDraftLayout] = useState(filters.layout)
  const [draftColumns, setDraftColumns] = useState(filters.columns)

  const filterRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchValue(filters.search)
  }, [filters.search])

  useEffect(() => {
    if (!showFilterPanel) return
    setDraftSort(filters.sort)
    setDraftDirection(filters.direction)
    setDraftStatus(filters.status)
    setDraftTier(filters.tier)
    setDraftGenres(filters.genres)
    setDraftSources(filters.sources)
    setDraftModes(filters.modes)
  }, [showFilterPanel, filters])

  useEffect(() => {
    if (!showLayoutPanel) return
    setDraftLayout(filters.layout)
    setDraftColumns(filters.columns)
  }, [showLayoutPanel, filters.layout, filters.columns])

  function replaceParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    mutator(params)
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  function setMultiParam(params: URLSearchParams, key: string, values: string[]) {
    if (values.length === 0) {
      params.delete(key)
    } else {
      params.set(key, values.join(','))
    }
  }

  function removeSingleChip(chip: FilterChip) {
    if (chip.key === 'search') {
      setSearchValue('')
      replaceParams((params) => {
        params.delete('search')
      })
      return
    }

    if (chip.key === 'status' || chip.key === 'tier') {
      replaceParams((params) => {
        params.delete(chip.key)
      })
      return
    }

    if (chip.key === 'genre') {
      replaceParams((params) => {
        setMultiParam(
          params,
          'genre',
          filters.genres.filter((value) => value !== chip.value)
        )
      })
      return
    }

    if (chip.key === 'source') {
      replaceParams((params) => {
        setMultiParam(
          params,
          'source',
          filters.sources.filter((value) => value !== chip.value)
        )
      })
      return
    }

    if (chip.key === 'mode') {
      replaceParams((params) => {
        setMultiParam(
          params,
          'mode',
          filters.modes.filter((value) => value !== chip.value)
        )
      })
    }
  }

  function clearAllFilters() {
    setSearchValue('')
    replaceParams((params) => {
      ;['search', 'status', 'tier', 'genre', 'source', 'mode'].forEach((key) =>
        params.delete(key)
      )
    })
    setShowFilterPanel(false)
  }

  function applyFilterDrafts() {
    replaceParams((params) => {
      if (!draftSort || draftSort === 'lastPlayed') {
        params.delete('sort')
      } else {
        params.set('sort', draftSort)
      }

      if (!draftDirection || draftDirection === 'desc') {
        params.delete('direction')
      } else {
        params.set('direction', draftDirection)
      }

      if (draftStatus === 'all') {
        params.delete('status')
      } else {
        params.set('status', draftStatus)
      }

      if (draftTier === 'all') {
        params.delete('tier')
      } else {
        params.set('tier', draftTier)
      }

      setMultiParam(params, 'genre', draftGenres)
      setMultiParam(params, 'source', draftSources)
      setMultiParam(params, 'mode', draftModes)
    })

    setShowFilterPanel(false)
  }

  function applyLayoutDrafts() {
    replaceParams((params) => {
      if (draftLayout === 'grid') {
        params.delete('layout')
      } else {
        params.set('layout', draftLayout)
      }

      if (draftLayout === 'list') {
        params.delete('columns')
      } else if (draftColumns === '4') {
        params.delete('columns')
      } else {
        params.set('columns', draftColumns)
      }
    })

    setShowLayoutPanel(false)
  }

  function toggleInArray(current: string[], value: string) {
    return current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get('search') ?? ''
      const nextSearch = searchValue.trim()

      if (currentSearch === nextSearch) return

      replaceParams((params) => {
        if (!nextSearch) {
          params.delete('search')
        } else {
          params.set('search', nextSearch)
        }
      })
    }, 180)

    return () => clearTimeout(timeout)
  }, [searchValue])

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

    for (const genre of filters.genres) {
      chips.push({ key: 'genre', label: 'Genre', value: genre })
    }

    for (const source of filters.sources) {
      chips.push({
        key: 'source',
        label: 'Source',
        value: sourceOptions.find((item) => item.value === source)?.label ?? source,
      })
    }

    for (const mode of filters.modes) {
      chips.push({ key: 'mode', label: 'Mode', value: mode })
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
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 hover:border-white/15 focus:border-cyan-500/30 focus:bg-white/[0.06]"
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
              <div className="absolute right-0 z-50 mt-3 w-[320px] rounded-3xl border border-white/10 bg-[#0b1016]/96 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur xl:w-[344px]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                      Sort & Filter
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white">
                      Refine the view
                    </h3>
                  </div>

                  {activeChips.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
                    >
                      Reset
                    </button>
                  ) : null}
                </div>

                <div className="space-y-2.5">
                  <CompactSection title="Ordering">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <LabeledSelect
                        label="Sort by"
                        value={draftSort}
                        onChange={setDraftSort}
                        options={sortOptions}
                      />
                      <LabeledSelect
                        label="Direction"
                        value={draftDirection}
                        onChange={setDraftDirection}
                        options={directionOptions}
                      />
                    </div>
                  </CompactSection>

                  <CompactSection title="State">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <LabeledSelect
                        label="Manual status"
                        value={draftStatus}
                        onChange={setDraftStatus}
                        options={statusOptions}
                      />
                      <LabeledSelect
                        label="Play level"
                        value={draftTier}
                        onChange={setDraftTier}
                        options={tierOptions}
                      />
                    </div>
                  </CompactSection>

                  <CompactSection title="Sources">
                    <MultiSelectDropdown
                      label="Choose sources"
                      options={sourceOptions}
                      selected={draftSources}
                      onToggle={(value) => setDraftSources((current) => toggleInArray(current, value))}
                    />
                  </CompactSection>

                  <CompactSection title="Genres">
                    <MultiSelectDropdown
                      label="Choose genres"
                      options={genres.map((genre) => ({ value: genre, label: genre }))}
                      selected={draftGenres}
                      onToggle={(value) => setDraftGenres((current) => toggleInArray(current, value))}
                    />
                  </CompactSection>

                  {modes.length > 0 ? (
                    <CompactSection title="Play modes">
                      <MultiSelectDropdown
                        label="Choose play modes"
                        options={modes.map((mode) => ({ value: mode, label: mode }))}
                        selected={draftModes}
                        onToggle={(value) => setDraftModes((current) => toggleInArray(current, value))}
                      />
                    </CompactSection>
                  ) : null}

                  <CompactSection title="Queued filters">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...draftSources.map((value) => ({ key: 'source', label: value })),
                        ...draftGenres.map((value) => ({ key: 'genre', label: value })),
                        ...draftModes.map((value) => ({ key: 'mode', label: value })),
                        ...(draftStatus !== 'all'
                          ? [{ key: 'status', label: statusOptions.find((x) => x.value === draftStatus)?.label ?? draftStatus }]
                          : []),
                        ...(draftTier !== 'all'
                          ? [{ key: 'tier', label: tierOptions.find((x) => x.value === draftTier)?.label ?? draftTier }]
                          : []),
                      ].length === 0 ? (
                        <span className="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-xs text-neutral-500">
                          Nothing queued
                        </span>
                      ) : (
                        [
                          ...draftSources.map((value) => ({ key: 'source', label: value })),
                          ...draftGenres.map((value) => ({ key: 'genre', label: value })),
                          ...draftModes.map((value) => ({ key: 'mode', label: value })),
                          ...(draftStatus !== 'all'
                            ? [{ key: 'status', label: statusOptions.find((x) => x.value === draftStatus)?.label ?? draftStatus }]
                            : []),
                          ...(draftTier !== 'all'
                            ? [{ key: 'tier', label: tierOptions.find((x) => x.value === draftTier)?.label ?? draftTier }]
                            : []),
                        ].map((item, index) => (
                          <span
                            key={`${item.key}-${item.label}-${index}`}
                            className="rounded-full border border-cyan-500/15 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200"
                          >
                            {item.label}
                          </span>
                        ))
                      )}
                    </div>
                  </CompactSection>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/8 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowFilterPanel(false)}
                    className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={applyFilterDrafts}
                    disabled={isPending}
                    className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
                  >
                    Apply
                  </button>
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
              <div className="absolute right-0 z-50 mt-3 w-[232px] rounded-3xl border border-white/10 bg-[#0b1016]/96 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                    Layout
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">
                    Tune the view
                  </h3>
                </div>

                <div className="mt-3 space-y-2.5">
                  <CompactSection title="View mode">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDraftLayout('grid')}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          draftLayout === 'grid'
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
                        onClick={() => setDraftLayout('list')}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          draftLayout === 'list'
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
                  </CompactSection>

                  {draftLayout === 'grid' ? (
                    <CompactSection title="Grid density">
                      <div className="grid grid-cols-4 gap-2">
                        {columnOptions.map((option) => {
                          const Icon = option.icon
                          const active = draftColumns === option.value

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setDraftColumns(option.value as typeof draftColumns)}
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
                    </CompactSection>
                  ) : null}
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/8 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowLayoutPanel(false)}
                    className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={applyLayoutDrafts}
                    disabled={isPending}
                    className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
                  >
                    Apply
                  </button>
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
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => removeSingleChip(chip)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
            >
              <span className="text-neutral-500">{chip.label}</span>
              <span>{chip.value}</span>
              <X size={12} className="text-neutral-500" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CompactSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </section>
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
  onChange: (value: any) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-2xl border border-white/10 bg-neutral-950/70 px-3 text-sm text-white outline-none transition hover:border-white/15 focus:border-cyan-500/30"
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

function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: Array<{ value: string; label: string }>
  selected: string[]
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const preview =
    selected.length === 0
      ? label
      : selected.length <= 2
        ? selected.join(', ')
        : `${selected.length} selected`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-2xl border border-white/10 bg-neutral-950/70 px-3 text-left text-sm text-white transition hover:border-white/15"
      >
        <span className="truncate">{preview}</span>
        <ChevronDown size={15} className="text-neutral-400" />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1016] p-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
          {options.length === 0 ? (
            <div className="px-2 py-2 text-xs text-neutral-500">No options available</div>
          ) : (
            <div className="space-y-1">
              {options.map((option) => {
                const active = selected.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggle(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                      active
                        ? 'bg-cyan-500/12 text-cyan-200'
                        : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {active ? <Check size={14} /> : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
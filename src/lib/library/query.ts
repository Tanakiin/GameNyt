import { GameSource, GameStatus, Prisma } from '@prisma/client'

export type LibraryLayout = 'grid' | 'list'
export type LibrarySort = 'recent' | 'title' | 'playtime' | 'rating' | 'lastPlayed'
export type SortDirection = 'asc' | 'desc'
export type GridColumns = '2' | '3' | '4' | '5'

export type LibraryFilters = {
  search: string
  status: 'all' | Lowercase<GameStatus>
  source: 'all' | Lowercase<GameSource>
  genre: string
  layout: LibraryLayout
  sort: LibrarySort
  direction: SortDirection
  columns: GridColumns
}

export function parseLibraryFilters(
  params: Record<string, string | string[] | undefined>
): LibraryFilters {
  const getValue = (key: string) => {
    const value = params[key]
    return Array.isArray(value) ? value[0] ?? '' : value ?? ''
  }

  const layout = getValue('layout')
  const sort = getValue('sort')
  const status = getValue('status')
  const source = getValue('source')
  const columns = getValue('columns')
  const direction = getValue('direction')

  return {
    search: getValue('search').trim(),
    genre: getValue('genre').trim(),
    layout: layout === 'list' ? 'list' : 'grid',
    sort:
      sort === 'title' ||
      sort === 'playtime' ||
      sort === 'rating' ||
      sort === 'lastPlayed'
        ? sort
        : 'recent',
    direction: direction === 'asc' ? 'asc' : 'desc',
    status:
      status === 'unplayed' ||
      status === 'playing' ||
      status === 'finished' ||
      status === 'dropped'
        ? status
        : 'all',
    source:
      source === 'steam' ||
      source === 'epic' ||
      source === 'manual' ||
      source === 'console' ||
      source === 'other'
        ? source
        : 'all',
    columns:
      columns === '2' || columns === '3' || columns === '4' || columns === '5'
        ? columns
        : '4',
  }
}

export function buildLibraryWhere(
  userId: string,
  filters: LibraryFilters
): Prisma.UserGameWhereInput {
  const where: Prisma.UserGameWhereInput = {
    userId,
  }

  if (filters.status !== 'all') {
    where.status = filters.status.toUpperCase() as GameStatus
  }

  if (filters.source !== 'all') {
    where.source = filters.source.toUpperCase() as GameSource
  }

  if (filters.search) {
    where.game = {
      title: {
        contains: filters.search,
        mode: 'insensitive',
      },
    }
  }

  return where
}

export function buildLibraryOrderBy(
  filters: LibraryFilters
): Prisma.UserGameOrderByWithRelationInput[] {
  const dir = filters.direction

  switch (filters.sort) {
    case 'title':
      return [{ game: { title: dir } }]
    case 'playtime':
      return [{ playtimeMinutes: dir }, { createdAt: 'desc' }]
    case 'rating':
      return [{ personalRating: dir }, { createdAt: 'desc' }]
    case 'lastPlayed':
      return [{ lastPlayedAt: dir }, { createdAt: 'desc' }]
    case 'recent':
    default:
      return [{ createdAt: dir }]
  }
}

export function getGridClass(columns: GridColumns) {
  switch (columns) {
    case '2':
      return 'grid gap-4 md:grid-cols-2'
    case '3':
      return 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
    case '5':
      return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5'
    case '4':
    default:
      return 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
  }
}
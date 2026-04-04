import { GameSource, GameStatus, Prisma } from '@prisma/client'

export type LibraryLayout = 'grid' | 'list'
export type LibrarySort =
  | 'recent'
  | 'title'
  | 'playtime'
  | 'rating'
  | 'lastPlayed'

export type LibraryFilters = {
  search: string
  status: 'all' | Lowercase<GameStatus>
  source: 'all' | Lowercase<GameSource>
  genre: string
  layout: LibraryLayout
  sort: LibrarySort
}

export function parseLibraryFilters(params: Record<string, string | string[] | undefined>): LibraryFilters {
  const getValue = (key: string) => {
    const value = params[key]
    return Array.isArray(value) ? value[0] ?? '' : value ?? ''
  }

  const layout = getValue('layout')
  const sort = getValue('sort')
  const status = getValue('status')
  const source = getValue('source')

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
  }
}

export function buildLibraryWhere(userId: string, filters: LibraryFilters): Prisma.UserGameWhereInput {
  const where: Prisma.UserGameWhereInput = {
    userId,
  }

  if (filters.status !== 'all') {
    where.status = filters.status.toUpperCase() as GameStatus
  }

  if (filters.source !== 'all') {
    where.source = filters.source.toUpperCase() as GameSource
  }

  if (filters.search || filters.genre) {
    where.game = {}
  }

  if (filters.search) {
    where.game = {
      ...where.game,
      title: {
        contains: filters.search,
        mode: 'insensitive',
      },
    }
  }

  if (filters.genre) {
    where.game = {
      ...where.game,
      genres: {
        path: '$[*].name',
        array_contains: [filters.genre],
      },
    }
  }

  return where
}

export function buildLibraryOrderBy(filters: LibraryFilters): Prisma.UserGameOrderByWithRelationInput[] {
  switch (filters.sort) {
    case 'title':
      return [{ game: { title: 'asc' } }]
    case 'playtime':
      return [{ playtimeMinutes: 'desc' }, { createdAt: 'desc' }]
    case 'rating':
      return [{ personalRating: 'desc' }, { createdAt: 'desc' }]
    case 'lastPlayed':
      return [{ lastPlayedAt: 'desc' }, { createdAt: 'desc' }]
    case 'recent':
    default:
      return [{ createdAt: 'desc' }]
  }
}
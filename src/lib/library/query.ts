import { GameSource, GameStatus, Prisma, type Game, type UserGame } from '@prisma/client'
import { getPlayTier, normalizeNameList } from '@/lib/games/metadata'

export type LibraryLayout = 'grid' | 'list'
export type LibrarySort = 'recent' | 'title' | 'playtime' | 'rating' | 'lastPlayed'
export type SortDirection = 'asc' | 'desc'
export type GridColumns = '2' | '3' | '4' | '5'
export type LibraryTierFilter = 'all' | 'untouched' | 'tried' | 'played' | 'heavy'
export type LibraryStatusFilter = 'all' | 'backlog' | 'playing' | 'finished' | 'dropped'

export type LibraryFilters = {
  search: string
  status: LibraryStatusFilter
  source: 'all' | Lowercase<GameSource>
  genre: string
  tier: LibraryTierFilter
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
  const tier = getValue('tier')

  return {
    search: getValue('search').trim(),
    genre: getValue('genre').trim(),
    tier:
      tier === 'untouched' ||
      tier === 'tried' ||
      tier === 'played' ||
      tier === 'heavy'
        ? tier
        : 'all',
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
      status === 'backlog' ||
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
    const statusMap: Record<Exclude<LibraryStatusFilter, 'all'>, GameStatus> = {
      backlog: GameStatus.UNPLAYED,
      playing: GameStatus.PLAYING,
      finished: GameStatus.FINISHED,
      dropped: GameStatus.DROPPED,
    }

    where.status = statusMap[filters.status]
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
      return [{ personalRating: dir }, { game: { rawgRating: dir } }, { createdAt: 'desc' }]
    case 'lastPlayed':
      return [
        {
          lastPlayedAt: {
            sort: dir,
            nulls: 'last',
          },
        },
        { createdAt: 'desc' },
      ]
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

type LibraryItem = UserGame & {
  game: Game
}

export function matchesLibraryClientFilters(item: LibraryItem, filters: LibraryFilters) {
  if (filters.genre) {
    const genres = normalizeNameList(item.game.genres)
    const hasGenre = genres.some(
      (genre) => genre.toLowerCase() === filters.genre.toLowerCase()
    )

    if (!hasGenre) {
      return false
    }
  }

  if (filters.tier !== 'all') {
    const tier = getPlayTier(item.playtimeMinutes)

    const tierMap = {
      untouched: 'UNTOUCHED',
      tried: 'TRIED',
      played: 'PLAYED',
      heavy: 'HEAVILY_PLAYED',
    } as const

    if (tier !== tierMap[filters.tier]) {
      return false
    }
  }

  return true
}
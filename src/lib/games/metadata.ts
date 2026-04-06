import type { Game, GameStatus, Prisma } from '@prisma/client'

type JsonValue = Prisma.JsonValue

export type PlayTier = 'UNTOUCHED' | 'TRIED' | 'PLAYED' | 'HEAVILY_PLAYED'

export function normalizeNameList(value: JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim()

      if (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        'name' in item &&
        typeof item.name === 'string'
      ) {
        return item.name.trim()
      }

      if (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        'platform' in item &&
        item.platform &&
        typeof item.platform === 'object' &&
        'name' in item.platform &&
        typeof item.platform.name === 'string'
      ) {
        return item.platform.name.trim()
      }

      return null
    })
    .filter((item): item is string => Boolean(item))
}

export function normalizeImageList(value: JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim()

      if (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        'url' in item &&
        typeof item.url === 'string'
      ) {
        return item.url.trim()
      }

      if (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        'image' in item &&
        typeof item.image === 'string'
      ) {
        return item.image.trim()
      }

      return null
    })
    .filter((item): item is string => Boolean(item))
}

export function getGameImageUrls(
  game: Pick<Game, 'coverUrl' | 'backgroundImageUrl' | 'screenshots'>
) {
  const images = [
    game.coverUrl ?? null,
    game.backgroundImageUrl ?? null,
    ...normalizeImageList(game.screenshots),
  ].filter((item): item is string => Boolean(item))

  return Array.from(new Set(images))
}

export function getPlayTier(playtimeMinutes: number | null | undefined): PlayTier {
  const minutes = playtimeMinutes ?? 0

  if (minutes <= 0) return 'UNTOUCHED'
  if (minutes < 120) return 'TRIED'
  if (minutes < 900) return 'PLAYED'
  return 'HEAVILY_PLAYED'
}

export function getPlayTierLabel(playTier: PlayTier) {
  switch (playTier) {
    case 'UNTOUCHED':
      return 'Untouched'
    case 'TRIED':
      return 'Tried'
    case 'PLAYED':
      return 'Played'
    case 'HEAVILY_PLAYED':
      return 'Heavily played'
  }
}

export function getStatusLabel(status: GameStatus | null | undefined) {
  switch (status) {
    case 'UNPLAYED':
      return 'Backlog'
    case 'PLAYING':
      return 'In progress'
    case 'FINISHED':
      return 'Finished'
    case 'DROPPED':
      return 'Dropped'
    default:
      return 'Backlog'
  }
}

export function formatPlaytime(minutes: number | null | undefined) {
  const value = minutes ?? 0

  if (value <= 0) return '0h'

  const hours = Math.floor(value / 60)
  const mins = value % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatDateShort(date: Date | null | undefined) {
  if (!date) return 'Unknown'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const modeMatchers: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bsingleplayer\b/i, label: 'Singleplayer' },
  { pattern: /\bonline co-?op\b/i, label: 'Online Co-Op' },
  { pattern: /\blocal co-?op\b/i, label: 'Local Co-Op' },
  { pattern: /\bco-?op\b/i, label: 'Co-Op' },
  { pattern: /\bonline pvp\b/i, label: 'Online PvP' },
  { pattern: /\blocal multiplayer\b/i, label: 'Local Multiplayer' },
  { pattern: /\bcouch\b/i, label: 'Couch / Party' },
  { pattern: /\bshared\/split screen\b/i, label: 'Shared / Split Screen' },
  { pattern: /\bsplit screen\b/i, label: 'Shared / Split Screen' },
  { pattern: /\blan co-?op\b/i, label: 'LAN Co-Op' },
  { pattern: /\blan pvp\b/i, label: 'LAN PvP' },
  { pattern: /\bmultiplayer\b/i, label: 'Multiplayer' },
]

export function extractPlayModes(value: unknown): string[] {
  const names = normalizeNameList(value as JsonValue | null | undefined)
  const found = new Set<string>()

  for (const name of names) {
    for (const matcher of modeMatchers) {
      if (matcher.pattern.test(name)) {
        found.add(matcher.label)
      }
    }
  }

  return Array.from(found)
}
import { prisma } from '@/lib/prisma'
import { getRawgGameDetails } from '@/lib/rawg/client'

type RawgGameDetails = {
  id?: number
  slug?: string
  name?: string
  description_raw?: string
  description?: string
  released?: string
  rating?: number
  background_image?: string
  background_image_additional?: string
  genres?: Array<{ id?: number; name?: string; slug?: string }>
  platforms?: Array<{
    platform?: { id?: number; name?: string; slug?: string }
  }>
}

function getRawgApiKey() {
  const key = process.env.RAWG_API_KEY

  if (!key) {
    throw new Error('Missing RAWG_API_KEY')
  }

  return key
}

async function getRawgScreenshots(rawgId: number): Promise<string[]> {
  const key = getRawgApiKey()
  const url = new URL(`https://api.rawg.io/api/games/${rawgId}/screenshots`)
  url.searchParams.set('key', key)
  url.searchParams.set('page_size', '10')

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const data: { results?: Array<{ image?: string | null }> } = await response.json()

  const results = Array.isArray(data.results) ? data.results : []

  return results
    .map((item: { image?: string | null }) =>
      typeof item.image === 'string' ? item.image.trim() : null
    )
    .filter((item): item is string => Boolean(item))
}

function normalizeGenres(rawgGame: RawgGameDetails) {
  if (!Array.isArray(rawgGame.genres)) return []

  return rawgGame.genres
    .map((genre) => ({
      id: genre.id ?? null,
      name: genre.name ?? '',
      slug: genre.slug ?? '',
    }))
    .filter((genre) => genre.name)
}

function normalizePlatforms(rawgGame: RawgGameDetails) {
  if (!Array.isArray(rawgGame.platforms)) return []

  return rawgGame.platforms
    .map((entry) => ({
      id: entry.platform?.id ?? null,
      name: entry.platform?.name ?? '',
      slug: entry.platform?.slug ?? '',
    }))
    .filter((platform) => platform.name)
}

export async function upsertGameFromRawg(rawgId: number) {
  const rawgGame = (await getRawgGameDetails(rawgId)) as RawgGameDetails
  const screenshots = await getRawgScreenshots(rawgId)

  const coverUrl = rawgGame.background_image ?? null
  const backgroundImageUrl = rawgGame.background_image_additional ?? null

  const dedupedScreenshots = Array.from(
    new Set(
      [
        coverUrl,
        backgroundImageUrl,
        ...screenshots,
      ].filter((item): item is string => Boolean(item))
    )
  )

  const payload = {
    rawgId,
    title: rawgGame.name?.trim() || `RAWG Game ${rawgId}`,
    slug: rawgGame.slug ?? null,
    coverUrl,
    backgroundImageUrl,
    screenshots: dedupedScreenshots,
    description: rawgGame.description_raw ?? rawgGame.description ?? null,
    releaseDate: rawgGame.released ? new Date(rawgGame.released) : null,
    rawgRating: typeof rawgGame.rating === 'number' ? rawgGame.rating : null,
    genres: normalizeGenres(rawgGame),
    platforms: normalizePlatforms(rawgGame),
  }

  const existing = await prisma.game.findUnique({
    where: { rawgId },
  })

  if (existing) {
    return prisma.game.update({
      where: { id: existing.id },
      data: payload,
    })
  }

  return prisma.game.create({
    data: payload,
  })
}
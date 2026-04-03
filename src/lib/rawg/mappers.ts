import type { RawgGameDetails, RawgSearchGame } from '@/lib/rawg/types'

export function mapGenres(genres: Array<{ id: number; name: string; slug: string }> = []) {
  return genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
    slug: genre.slug,
  }))
}

export function mapPlatforms(
  platforms: Array<{ platform: { id: number; name: string; slug: string } }> = []
) {
  return platforms.map((entry) => ({
    id: entry.platform.id,
    name: entry.platform.name,
    slug: entry.platform.slug,
  }))
}

export function mapRawgSearchGame(game: RawgSearchGame) {
  return {
    rawgId: game.id,
    title: game.name,
    slug: game.slug,
    coverUrl: game.background_image,
    releaseDate: game.released,
    rawgRating: game.rating,
    genres: mapGenres(game.genres),
    platforms: mapPlatforms(game.platforms),
  }
}

export function mapRawgGameDetails(game: RawgGameDetails) {
  return {
    rawgId: game.id,
    title: game.name,
    slug: game.slug,
    coverUrl: game.background_image,
    description: game.description_raw,
    releaseDate: game.released,
    rawgRating: game.rating,
    genres: mapGenres(game.genres),
    platforms: mapPlatforms(game.platforms),
  }
}
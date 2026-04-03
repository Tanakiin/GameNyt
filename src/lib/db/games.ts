import { prisma } from '@/lib/prisma'
import { mapRawgGameDetails } from '@/lib/rawg/mappers'
import { getRawgGameDetails } from '@/lib/rawg/client'

export async function upsertGameFromRawg(rawgId: number) {
  const existing = await prisma.game.findUnique({
    where: { rawgId },
  })

  if (existing) {
    return existing
  }

  const rawgGame = await getRawgGameDetails(rawgId)
  const mapped = mapRawgGameDetails(rawgGame)

  return prisma.game.create({
    data: {
      rawgId: mapped.rawgId,
      title: mapped.title,
      slug: mapped.slug,
      coverUrl: mapped.coverUrl,
      description: mapped.description,
      releaseDate: mapped.releaseDate ? new Date(mapped.releaseDate) : null,
      rawgRating: mapped.rawgRating,
      genres: mapped.genres,
      platforms: mapped.platforms,
    },
  })
}
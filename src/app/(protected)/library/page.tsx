import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { Button } from '@/components/ui/button'
import {
  buildLibraryOrderBy,
  buildLibraryWhere,
  parseLibraryFilters,
} from '@/lib/library/query'
import { LibraryControls } from './library-controls'
import { LibraryGridCard } from './library-grid-card'
import { LibraryListRow } from './library-list-row'

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return null
  }

  const params = (await searchParams) ?? {}
  const filters = parseLibraryFilters(params)

  const userGames = await prisma.userGame.findMany({
    where: buildLibraryWhere(currentUser.id, filters),
    include: {
      game: true,
    },
    orderBy: buildLibraryOrderBy(filters),
  })

  const allUserGames = await prisma.userGame.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      game: true,
    },
  })

  const genres = Array.from(
    new Set(
      allUserGames.flatMap((item) => {
        const rawGenres = item.game.genres
        if (!Array.isArray(rawGenres)) return []
        return rawGenres
          .map((genre) =>
            typeof genre === 'object' &&
            genre !== null &&
            'name' in genre &&
            typeof genre.name === 'string'
              ? genre.name
              : null
          )
          .filter((value): value is string => Boolean(value))
      })
    )
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Library</p>
          <h2 className="text-3xl font-semibold tracking-tight">Your games</h2>
          <p className="mt-2 text-neutral-400">
            Browse, sort, and filter your library across all sources.
          </p>
        </div>

        <Link href="/library/add">
          <Button className="!bg-white !text-black hover:!bg-neutral-200">
            Add game
          </Button>
        </Link>
      </div>

      <LibraryControls filters={filters} genres={genres} />

      {userGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
          No games match your current filters.
        </div>
      ) : filters.layout === 'list' ? (
        <div className="space-y-3">
          {userGames.map((item) => (
            <LibraryListRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userGames.map((item) => (
            <LibraryGridCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
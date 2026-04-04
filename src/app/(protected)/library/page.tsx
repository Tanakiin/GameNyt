import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import {
  buildLibraryOrderBy,
  buildLibraryWhere,
  getGridClass,
  parseLibraryFilters,
} from '@/lib/library/query'
import { LibraryToolbar } from './library-toolbar'
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
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Library</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Your games</h2>
          <p className="mt-2 text-neutral-400">
            Browse your collection with compact controls and customizable layouts.
          </p>
        </div>

        <Link
          href="/library/add"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium !text-black hover:bg-neutral-200"
        >
          Add game
        </Link>
      </div>

      <LibraryToolbar filters={filters} genres={genres} />

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
        <div className={getGridClass(filters.columns)}>
          {userGames.map((item) => (
            <LibraryGridCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
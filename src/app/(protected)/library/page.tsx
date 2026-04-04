import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import { normalizeNameList } from '@/lib/games/metadata'
import {
  buildLibraryOrderBy,
  buildLibraryWhere,
  getGridClass,
  matchesLibraryClientFilters,
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
  const currentUser = await requireCurrentUser()
  const params = (await searchParams) ?? {}
  const filters = parseLibraryFilters(params)

  const userGames = await prisma.userGame.findMany({
    where: buildLibraryWhere(currentUser.id, filters),
    include: {
      game: true,
    },
    orderBy: buildLibraryOrderBy(filters),
  })

  const filteredUserGames = userGames.filter((item) =>
    matchesLibraryClientFilters(item, filters)
  )

  const allUserGames = await prisma.userGame.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      game: true,
    },
  })

  const genres = Array.from(
    new Set(allUserGames.flatMap((item) => normalizeNameList(item.game.genres)))
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Library</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Your games</h2>
          <p className="mt-2 text-neutral-400">
            Browse your collection with better play tiers, richer metadata, and cleaner filters.
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

      {filteredUserGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
          No games match your current filters.
        </div>
      ) : filters.layout === 'list' ? (
        <div className="space-y-3">
          {filteredUserGames.map((item) => (
            <LibraryListRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className={getGridClass(filters.columns)}>
          {filteredUserGames.map((item) => (
            <LibraryGridCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
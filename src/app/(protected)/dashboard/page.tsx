import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) return null

  const userGames = await prisma.userGame.findMany({
    where: { userId: currentUser.id },
    include: { game: true },
  })

  const totalGames = userGames.length
  const totalPlaytimeMinutes = userGames.reduce((sum, game) => sum + game.playtimeMinutes, 0)
  const unplayedCount = userGames.filter((game) => game.status === 'UNPLAYED').length
  const steamCount = userGames.filter((game) => game.source === 'STEAM').length

  const topGenres = new Map<string, number>()
  for (const userGame of userGames) {
    const genres = Array.isArray(userGame.game.genres) ? userGame.game.genres : []
    for (const genre of genres as Array<{ name?: string }>) {
      if (!genre?.name) continue
      topGenres.set(genre.name, (topGenres.get(genre.name) ?? 0) + 1)
    }
  }

  const topGenreEntries = [...topGenres.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-neutral-500">Dashboard</p>
        <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-2 text-neutral-400">
          A quick read on your library, backlog, and Steam imports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Total games</p>
          <p className="mt-2 text-3xl font-semibold">{totalGames}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Total playtime</p>
          <p className="mt-2 text-3xl font-semibold">{Math.floor(totalPlaytimeMinutes / 60)}h</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Unplayed backlog</p>
          <p className="mt-2 text-3xl font-semibold">{unplayedCount}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Steam imports</p>
          <p className="mt-2 text-3xl font-semibold">{steamCount}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold text-white">Top genres</h3>
          <div className="mt-4 space-y-3">
            {topGenreEntries.length ? (
              topGenreEntries.map(([genre, count]) => (
                <div key={genre} className="flex items-center justify-between rounded-xl bg-neutral-950 px-4 py-3">
                  <span className="text-neutral-200">{genre}</span>
                  <span className="text-neutral-500">{count} games</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400">No genre data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold text-white">Next up</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Once the recommendation engine lands, this area becomes your quick pick zone.
          </p>
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        Game metadata and imagery from RAWG.
      </p>
    </div>
  )
}
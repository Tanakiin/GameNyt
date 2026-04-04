import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth/require-current-user'

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser()

  const userGames = await prisma.userGame.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      game: true,
    },
  })

  const totalGames = userGames.length
  const totalPlaytimeMinutes = userGames.reduce(
    (sum, game) => sum + (game.playtimeMinutes ?? 0),
    0
  )
  const untouchedCount = userGames.filter((game) => (game.playtimeMinutes ?? 0) === 0).length
  const inProgressCount = userGames.filter((game) => game.status === 'PLAYING').length
  const finishedCount = userGames.filter((game) => game.status === 'FINISHED').length

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">Total games</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalGames}</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">Total playtime</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalPlaytimeMinutes} min</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">Untouched</p>
          <p className="mt-2 text-3xl font-semibold text-white">{untouchedCount}</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">In progress / Finished</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {inProgressCount} / {finishedCount}
          </p>
        </div>
      </div>
    </div>
  )
}
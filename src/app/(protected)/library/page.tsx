import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { Button } from '@/components/ui/button'

export default async function LibraryPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return null
  }

  const userGames = await prisma.userGame.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      game: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Library</p>
          <h2 className="text-3xl font-semibold tracking-tight">Your games</h2>
        </div>

        <Link href="/library/add">
          <Button>Add game</Button>
        </Link>
      </div>

      {userGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
          Your library is empty. Add your first game to get started.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userGames.map((userGame) => (
            <div
              key={userGame.id}
              className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
            >
              <div className="aspect-[16/9] w-full bg-neutral-950">
                {userGame.game.coverUrl ? (
                  <img
                    src={userGame.game.coverUrl}
                    alt={userGame.game.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-sm text-neutral-500">
                      No image
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {userGame.game.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    Source: {userGame.source.toLowerCase()}
                  </p>
                </div>

                <p className="text-sm text-neutral-400">
                  Status:{' '}
                  <span className="text-neutral-200">
                    {userGame.status.toLowerCase()}
                  </span>
                </p>

                <p className="text-sm text-neutral-400">
                  Playtime:{' '}
                  <span className="text-neutral-200">
                    {userGame.playtimeMinutes} minutes
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
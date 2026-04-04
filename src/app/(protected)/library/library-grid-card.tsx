import type { Game, UserGame } from '@prisma/client'

type LibraryItem = UserGame & {
  game: Game
}

type LibraryGridCardProps = {
  item: LibraryItem
}

export function LibraryGridCard({ item }: LibraryGridCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="aspect-[16/9] w-full bg-neutral-950">
        {item.game.coverUrl ? (
          <img
            src={item.game.coverUrl}
            alt={item.game.title}
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
          <h3 className="text-lg font-semibold text-white">{item.game.title}</h3>
          <p className="mt-1 text-sm text-neutral-400">
            {item.source.toLowerCase()} • {item.status.toLowerCase()}
          </p>
        </div>

        <div className="space-y-1 text-sm text-neutral-400">
          <p>
            Playtime: <span className="text-neutral-200">{item.playtimeMinutes} min</span>
          </p>
          <p>
            Rating:{' '}
            <span className="text-neutral-200">
              {item.personalRating ?? 'N/A'}
            </span>
          </p>
          <p>
            Last played:{' '}
            <span className="text-neutral-200">
              {item.lastPlayedAt ? new Date(item.lastPlayedAt).toLocaleDateString() : 'Never'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
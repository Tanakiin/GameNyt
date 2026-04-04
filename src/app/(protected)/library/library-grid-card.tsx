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
      <div className="aspect-[16/10] w-full bg-neutral-950">
        {item.game.coverUrl ? (
          <img
            src={item.game.coverUrl}
            alt={item.game.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-xs text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-white">{item.game.title}</h3>
          <p className="mt-1 text-xs text-neutral-400">
            {item.source.toLowerCase()} • {item.status.toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
          <div>
            <p className="text-neutral-500">Playtime</p>
            <p className="text-neutral-200">{item.playtimeMinutes} min</p>
          </div>
          <div>
            <p className="text-neutral-500">Rating</p>
            <p className="text-neutral-200">{item.personalRating ?? 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
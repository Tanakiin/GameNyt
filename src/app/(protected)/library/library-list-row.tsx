import Link from 'next/link'
import type { Game, UserGame } from '@prisma/client'

type LibraryItem = UserGame & {
  game: Game
}

type LibraryListRowProps = {
  item: LibraryItem
}

export function LibraryListRow({ item }: LibraryListRowProps) {
  const displayRating = item.personalRating ?? item.game.rawgRating ?? null
  const releaseYear = item.game.releaseDate
    ? new Date(item.game.releaseDate).getFullYear()
    : null

  return (
    <Link
      href={`/games/${item.gameId}`}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600 md:flex-row md:items-center"
    >
      <div className="h-24 w-full overflow-hidden rounded-xl bg-neutral-950 md:w-40">
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

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-white">{item.game.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">
          {item.source.toLowerCase()} • {item.status.toLowerCase()}
          {releaseYear ? ` • ${releaseYear}` : ''}
        </p>
      </div>

      <div className="grid gap-2 text-sm text-neutral-400 md:min-w-[320px] md:grid-cols-3">
        <div>
          <p className="text-neutral-500">Playtime</p>
          <p className="text-neutral-200">{item.playtimeMinutes} min</p>
        </div>
        <div>
          <p className="text-neutral-500">Rating</p>
          <p className="text-neutral-200">
            {displayRating ? Number(displayRating).toFixed(1) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-neutral-500">Last played</p>
          <p className="text-neutral-200">
            {item.lastPlayedAt ? new Date(item.lastPlayedAt).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>
    </Link>
  )
}
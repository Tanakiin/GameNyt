import Link from 'next/link'
import type { Game, UserGame } from '@prisma/client'

type LibraryItem = UserGame & {
  game: Game
}

type LibraryGridCardProps = {
  item: LibraryItem
}

export function LibraryGridCard({ item }: LibraryGridCardProps) {
  const genres = Array.isArray(item.game.genres)
    ? item.game.genres
        .map((genre) =>
          typeof genre === 'object' &&
          genre !== null &&
          'name' in genre &&
          typeof genre.name === 'string'
            ? genre.name
            : null
        )
        .filter((value): value is string => Boolean(value))
        .slice(0, 2)
    : []

  const displayRating = item.personalRating ?? item.game.rawgRating ?? null
  const releaseYear = item.game.releaseDate
    ? new Date(item.game.releaseDate).getFullYear()
    : null

  return (
    <Link
      href={`/games/${item.gameId}`}
      className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-600"
    >
      <div className="aspect-[16/10] w-full bg-neutral-950">
        {item.game.coverUrl ? (
          <img
            src={item.game.coverUrl}
            alt={item.game.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-xs text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-white">{item.game.title}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-neutral-400">
            <span className="rounded-full border border-neutral-700 px-2 py-0.5">
              {item.source.toLowerCase()}
            </span>
            <span className="rounded-full border border-neutral-700 px-2 py-0.5">
              {item.status.toLowerCase()}
            </span>
            {releaseYear ? (
              <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                {releaseYear}
              </span>
            ) : null}
          </div>
        </div>

        {genres.length > 0 ? (
          <p className="line-clamp-1 text-xs text-neutral-400">
            {genres.join(' • ')}
          </p>
        ) : null}

        <div className="grid grid-cols-3 gap-2 text-xs text-neutral-400">
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
              {item.lastPlayedAt
                ? new Date(item.lastPlayedAt).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
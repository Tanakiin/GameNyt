import Link from 'next/link'
import type { Game, UserGame } from '@prisma/client'
import {
  formatPlaytime,
  getGameImageUrls,
  getPlayTier,
  getPlayTierLabel,
  getStatusLabel,
  normalizeNameList,
} from '@/lib/games/metadata'

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
  const images = getGameImageUrls(item.game)
  const primaryImage = images[0] ?? null
  const genres = normalizeNameList(item.game.genres).slice(0, 4)
  const platforms = normalizeNameList(item.game.platforms).slice(0, 3)
  const playTier = getPlayTier(item.playtimeMinutes)

  return (
    <Link
      href={`/games/${item.gameId}`}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 transition hover:border-neutral-600 md:flex-row md:items-start"
    >
      <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-950 md:w-48">
        {primaryImage ? (
          <img
            src={primaryImage}
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
        <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">{item.game.title}</h3>

            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-300">
              <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                {item.source.toLowerCase()}
              </span>
              <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                {getStatusLabel(item.status)}
              </span>
              <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                {getPlayTierLabel(playTier)}
              </span>
              {releaseYear ? (
                <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                  {releaseYear}
                </span>
              ) : null}
            </div>

            {genres.length > 0 ? (
              <p className="mt-3 text-sm text-neutral-400">
                <span className="text-neutral-500">Genres:</span>{' '}
                <span className="text-neutral-300">{genres.join(' • ')}</span>
              </p>
            ) : null}

            {platforms.length > 0 ? (
              <p className="mt-1 text-sm text-neutral-400">
                <span className="text-neutral-500">Platforms:</span>{' '}
                <span className="text-neutral-300">{platforms.join(' • ')}</span>
              </p>
            ) : null}

            {item.notes ? (
              <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                {item.notes}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-neutral-400 md:min-w-[280px] xl:grid-cols-2">
            <Metric label="Playtime" value={formatPlaytime(item.playtimeMinutes)} />
            <Metric
              label="Rating"
              value={displayRating !== null ? Number(displayRating).toFixed(1) : 'N/A'}
            />
            <Metric
              label="Last played"
              value={item.lastPlayedAt ? new Date(item.lastPlayedAt).toLocaleDateString() : 'Never'}
            />
            <Metric label="Added" value={new Date(item.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-neutral-200">{value}</p>
    </div>
  )
}
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
  const genres = normalizeNameList(item.game.genres).slice(0, 2)
  const platforms = normalizeNameList(item.game.platforms).slice(0, 2)
  const playTier = getPlayTier(item.playtimeMinutes)

  return (
    <Link
      href={`/games/${item.gameId}`}
      className="group block rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3 transition hover:border-neutral-700 hover:bg-neutral-900"
    >
      <div className="flex items-center gap-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-950 sm:h-20 sm:w-32">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={item.game.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-xs text-neutral-500">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="hidden items-center justify-between gap-4 md:flex">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-white">
                  {item.game.title}
                </h3>

                <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                  {item.source.toLowerCase()}
                </span>
                <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                  {getStatusLabel(item.status)}
                </span>
                <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                  {getPlayTierLabel(playTier)}
                </span>
                {releaseYear ? (
                  <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                    {releaseYear}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 space-y-1">
                {genres.length > 0 ? (
                  <p className="truncate text-sm text-neutral-400">
                    <span className="text-neutral-500">Genres:</span>{' '}
                    <span className="text-neutral-300">{genres.join(' • ')}</span>
                  </p>
                ) : null}

                {platforms.length > 0 ? (
                  <p className="truncate text-sm text-neutral-400">
                    <span className="text-neutral-500">Platforms:</span>{' '}
                    <span className="text-neutral-300">{platforms.join(' • ')}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-4 gap-2">
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

          <div className="md:hidden">
            <h3 className="truncate text-base font-semibold text-white">
              {item.game.title}
            </h3>

            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                {item.source.toLowerCase()}
              </span>
              <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-300">
                {getStatusLabel(item.status)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-neutral-400">
              <div>
                <span className="text-neutral-500">Playtime:</span>{' '}
                <span className="text-neutral-200">{formatPlaytime(item.playtimeMinutes)}</span>
              </div>
              <div>
                <span className="text-neutral-500">Last played:</span>{' '}
                <span className="text-neutral-200">
                  {item.lastPlayedAt ? new Date(item.lastPlayedAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[102px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-neutral-100">{value}</p>
    </div>
  )
}
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
import { HoverScrubGallery } from '@/components/games/hover-scrub-gallery'

type LibraryItem = UserGame & {
  game: Game
}

type LibraryGridCardProps = {
  item: LibraryItem
}

export function LibraryGridCard({ item }: LibraryGridCardProps) {
  const genres = normalizeNameList(item.game.genres).slice(0, 3)
  const images = getGameImageUrls(item.game)
  const displayRating = item.personalRating ?? item.game.rawgRating ?? null
  const releaseYear = item.game.releaseDate
    ? new Date(item.game.releaseDate).getFullYear()
    : null
  const playTier = getPlayTier(item.playtimeMinutes)

  return (
    <Link
      href={`/games/${item.gameId}`}
      className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-600"
    >
      <HoverScrubGallery
        images={images}
        title={item.game.title}
        aspectClassName="aspect-[16/9]"
        roundedClassName="rounded-none"
      />

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-white">{item.game.title}</h3>

          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-neutral-400">
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
        </div>

        {genres.length > 0 ? (
          <p className="line-clamp-2 text-xs text-neutral-400">
            {genres.join(' • ')}
          </p>
        ) : null}

        <div className="grid grid-cols-3 gap-2 text-xs text-neutral-400">
          <div>
            <p className="text-neutral-500">Playtime</p>
            <p className="text-neutral-200">{formatPlaytime(item.playtimeMinutes)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Rating</p>
            <p className="text-neutral-200">
              {displayRating !== null ? Number(displayRating).toFixed(1) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Last played</p>
            <p className="text-neutral-200">
              {item.lastPlayedAt
                ? new Date(item.lastPlayedAt).toLocaleDateString()
                : item.playtimeMinutes > 0
                  ? 'Played before'
                  : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
import { AddGameButton } from '@/components/games/add-game-button'

type SearchGame = {
  rawgId: number
  title: string
  slug: string
  coverUrl: string | null
  releaseDate: string | null
  rawgRating: number | null
  genres: Array<{ id: number; name: string; slug: string }>
  platforms: Array<{ id: number; name: string; slug: string }>
}

type GameSearchCardProps = {
  game: SearchGame
}

export function GameSearchCard({ game }: GameSearchCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="aspect-[16/9] w-full bg-neutral-950">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{game.title}</h3>
          <p className="mt-1 text-sm text-neutral-400">
            {game.releaseDate || 'Unknown release date'}
          </p>
        </div>

        <div className="space-y-2 text-sm text-neutral-400">
          <p>
            Rating:{' '}
            <span className="text-neutral-200">
              {game.rawgRating ? game.rawgRating.toFixed(1) : 'N/A'}
            </span>
          </p>
          <p>
            Genres:{' '}
            <span className="text-neutral-200">
              {game.genres.length ? game.genres.map((genre) => genre.name).join(', ') : 'N/A'}
            </span>
          </p>
          <p>
            Platforms:{' '}
            <span className="text-neutral-200">
              {game.platforms.length
                ? game.platforms.map((platform) => platform.name).join(', ')
                : 'N/A'}
            </span>
          </p>
        </div>

        <AddGameButton rawgId={game.rawgId} />
      </div>
    </div>
  )
}
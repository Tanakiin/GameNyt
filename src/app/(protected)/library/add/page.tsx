
import { SearchClient } from './search-client'

export default function AddGamePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Library</p>
        <h2 className="text-3xl font-semibold tracking-tight">Add a game</h2>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Search RAWG and add games from Epic, console, or any source you want to track manually.
        </p>
      </div>

      <SearchClient />
    </div>
  )
}
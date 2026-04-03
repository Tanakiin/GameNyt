'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GameSearchCard } from '@/components/games/game-search-card'

type SearchResult = {
  rawgId: number
  title: string
  slug: string
  coverUrl: string | null
  releaseDate: string | null
  rawgRating: number | null
  genres: Array<{ id: number; name: string; slug: string }>
  platforms: Array<{ id: number; name: string; slug: string }>
}

export function SearchClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch() {
    const trimmed = query.trim()

    if (!trimmed) {
      setResults([])
      setHasSearched(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/rawg/search?query=${encodeURIComponent(trimmed)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setResults(data.results ?? [])
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setResults([])
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a game..."
          className="flex-1"
        />
        <Button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {!loading && hasSearched && results.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
          No games found.
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((game) => (
            <GameSearchCard key={game.rawgId} game={game} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
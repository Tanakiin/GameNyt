import { NextResponse } from 'next/server'
import { searchRawgGames } from '@/lib/rawg/client'
import { mapRawgSearchGame } from '@/lib/rawg/mappers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.trim()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const games = await searchRawgGames(query)
    const results = games.map(mapRawgSearchGame)
    return NextResponse.json({ results })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to search RAWG'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
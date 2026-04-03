import 'server-only'
import type { RawgGameDetails, RawgSearchResponse } from '@/lib/rawg/types'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

function getRawgApiKey() {
  const key = process.env.RAWG_API_KEY

  if (!key) {
    throw new Error('Missing RAWG_API_KEY')
  }

  return key
}

export async function searchRawgGames(query: string) {
  const key = getRawgApiKey()
  const url = new URL(`${RAWG_BASE_URL}/games`)
  url.searchParams.set('key', key)
  url.searchParams.set('search', query)
  url.searchParams.set('page_size', '12')

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RAWG search failed with status ${response.status}`)
  }

  const data = (await response.json()) as RawgSearchResponse
  return data.results ?? []
}

export async function getRawgGameDetails(rawgId: number) {
  const key = getRawgApiKey()
  const url = new URL(`${RAWG_BASE_URL}/games/${rawgId}`)
  url.searchParams.set('key', key)

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RAWG details failed with status ${response.status}`)
  }

  return (await response.json()) as RawgGameDetails
}
import 'server-only'
import type { SteamOwnedGamesResponse } from '@/lib/steam/types'

const STEAM_BASE_URL = 'https://partner.steam-api.com'

function getSteamApiKey() {
  const key = process.env.STEAM_API_KEY

  if (!key) {
    throw new Error('Missing STEAM_API_KEY')
  }

  return key
}

export async function getOwnedSteamGames(steamId: string) {
  const key = getSteamApiKey()
  const url = new URL(`${STEAM_BASE_URL}/IPlayerService/GetOwnedGames/v1/`)
  url.searchParams.set('key', key)
  url.searchParams.set('steamid', steamId)
  url.searchParams.set('include_appinfo', '1')
  url.searchParams.set('include_played_free_games', '1')

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Steam owned games request failed with status ${response.status}: ${body}`)
  }

  const data = (await response.json()) as SteamOwnedGamesResponse
  return data.response.games ?? []
}
import 'server-only'
import type { ResolveVanityResponse, SteamOwnedGamesResponse } from '@/lib/steam/types'
import { extractSteamId64, extractVanityFromInput } from '@/lib/steam/parsers'

const STEAM_BASE_URL = 'https://partner.steam-api.com'

function getSteamApiKey() {
  const key = process.env.STEAM_API_KEY

  if (!key) {
    throw new Error('Missing STEAM_API_KEY')
  }

  return key
}

export async function resolveSteamId(input: string) {
  const directSteamId = extractSteamId64(input)

  if (directSteamId) {
    return directSteamId
  }

  const vanity = extractVanityFromInput(input)

  if (!vanity) {
    throw new Error('Enter a valid Steam ID or Steam profile URL')
  }

  const key = getSteamApiKey()
  const url = new URL(`${STEAM_BASE_URL}/ISteamUser/ResolveVanityURL/v1/`)
  url.searchParams.set('key', key)
  url.searchParams.set('vanityurl', vanity)
  url.searchParams.set('url_type', '1')

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Steam vanity lookup failed with status ${response.status}`)
  }

  const data = (await response.json()) as ResolveVanityResponse

  if (data.response.success !== 1 || !data.response.steamid) {
    throw new Error('Could not resolve that Steam profile')
  }

  return data.response.steamid
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
    throw new Error(`Steam owned games request failed with status ${response.status}`)
  }

  const data = (await response.json()) as SteamOwnedGamesResponse
  return data.response.games ?? []
}
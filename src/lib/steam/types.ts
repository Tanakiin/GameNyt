export type SteamOwnedGame = {
  appid: number
  name?: string
  img_icon_url?: string
  playtime_forever?: number
  rtime_last_played?: number
}

export type SteamOwnedGamesResponse = {
  response: {
    game_count: number
    games?: SteamOwnedGame[]
  }
}

export type ResolveVanityResponse = {
  response: {
    success: number
    steamid?: string
    message?: string
  }
}
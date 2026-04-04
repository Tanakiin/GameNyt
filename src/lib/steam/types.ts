export type SteamOwnedGame = {
  appid: number
  name?: string
  playtime_forever?: number
  playtime_2weeks?: number
  rtime_last_played?: number
  img_icon_url?: string
  has_community_visible_stats?: boolean
}

export type SteamOwnedGamesResponse = {
  response: {
    game_count?: number
    games?: SteamOwnedGame[]
  }
}
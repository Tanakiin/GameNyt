export type RawgSearchGame = {
  id: number
  name: string
  slug: string
  released: string | null
  background_image: string | null
  rating: number | null
  genres: Array<{ id: number; name: string; slug: string }>
  platforms: Array<{
    platform: { id: number; name: string; slug: string }
  }>
}

export type RawgSearchResponse = {
  results: RawgSearchGame[]
}

export type RawgGameDetails = {
  id: number
  name: string
  slug: string
  description_raw: string | null
  released: string | null
  background_image: string | null
  rating: number | null
  genres: Array<{ id: number; name: string; slug: string }>
  platforms: Array<{
    platform: { id: number; name: string; slug: string }
  }>
}
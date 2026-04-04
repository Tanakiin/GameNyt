export function normalizeSteamInput(input: string) {
  return input.trim()
}

export function extractSteamId64(input: string) {
  const trimmed = input.trim()

  if (/^\d{17}$/.test(trimmed)) {
    return trimmed
  }

  const profilesMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/i)
  if (profilesMatch?.[1]) {
    return profilesMatch[1]
  }

  return null
}

export function extractVanityFromInput(input: string) {
  const trimmed = input.trim()

  const directIdMatch = trimmed.match(/steamcommunity\.com\/id\/([^/?#]+)/i)
  if (directIdMatch?.[1]) {
    return directIdMatch[1]
  }

  if (
    !trimmed.includes('/') &&
    !trimmed.includes('.') &&
    !/^\d{17}$/.test(trimmed) &&
    trimmed.length > 0
  ) {
    return trimmed
  }

  return null
}
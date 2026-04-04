export type PlayTier =
  | 'UNTUCHED'
  | 'TRIED'
  | 'PLAYED'
  | 'HEAVILY_PLAYED'

export function getPlayTier(minutes: number | null): PlayTier {
  if (!minutes || minutes === 0) return 'UNTUCHED'
  if (minutes < 120) return 'TRIED'
  if (minutes < 900) return 'PLAYED'
  return 'HEAVILY_PLAYED'
}
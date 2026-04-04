import crypto from 'crypto'

const STEAM_OPENID_ENDPOINT = 'https://steamcommunity.com/openid/login'

export function buildSteamOpenIdUrl(returnTo: string, realm: string, state?: string) {
  const url = new URL(STEAM_OPENID_ENDPOINT)
  const finalReturnTo = new URL(returnTo)

  if (state) {
    finalReturnTo.searchParams.set('state', state)
  }

  url.searchParams.set('openid.ns', 'http://specs.openid.net/auth/2.0')
  url.searchParams.set('openid.mode', 'checkid_setup')
  url.searchParams.set('openid.claimed_id', 'http://specs.openid.net/auth/2.0/identifier_select')
  url.searchParams.set('openid.identity', 'http://specs.openid.net/auth/2.0/identifier_select')
  url.searchParams.set('openid.return_to', finalReturnTo.toString())
  url.searchParams.set('openid.realm', realm)

  return url.toString()
}

export async function verifySteamOpenId(params: URLSearchParams) {
  const verificationParams = new URLSearchParams()

  for (const [key, value] of params.entries()) {
    if (key !== 'state') {
      verificationParams.set(key, value)
    }
  }

  verificationParams.set('openid.mode', 'check_authentication')

  const response = await fetch(STEAM_OPENID_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: verificationParams.toString(),
    cache: 'no-store',
  })

  const text = await response.text()
  return text.includes('is_valid:true')
}

export function extractSteamIdFromClaimedId(claimedId: string) {
  const match = claimedId.match(/\/openid\/id\/(\d{17})$/)
  return match?.[1] ?? null
}

export function makeStateToken() {
  return crypto.randomBytes(16).toString('hex')
}
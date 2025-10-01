import { getCompleteAddress } from './getCompleteAddress'

export async function getIsOnline(address: string) {
  const completeAddress = getCompleteAddress(address)
  const addresses = Array.isArray(completeAddress)
    ? completeAddress
    : [completeAddress]

  const results = await Promise.allSettled(
    addresses.map(async (ip) => {
      try {
        const res = await fetch(ip, { signal: AbortSignal.timeout(5000) })
        return res.ok
      } catch (err) {
        console.error('Error checking online status for', ip, err)
        return false
      }
    })
  )

  const statusByAddress: Record<string, boolean> = {}
  results.forEach((result, idx) => {
    const ip = addresses[idx]
    if (result.status === 'fulfilled' && result.value === true) {
      statusByAddress[ip] = true
    } else {
      statusByAddress[ip] = false
    }
  })

  return statusByAddress
}

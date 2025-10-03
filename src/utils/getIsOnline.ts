import { getCompleteAddress } from "./getCompleteAddress"

type GetIsOnlineProps = {
  address: string
  updateItemLoading: (item: string, loading: boolean) => void
  updateItemStatus: (item: string, online: boolean) => void
}

export async function getIsOnline({
  address,
  updateItemLoading,
  updateItemStatus,
}: GetIsOnlineProps) {
  const completeAddress = getCompleteAddress(address)
  const addresses = Array.isArray(completeAddress)
    ? completeAddress
    : [completeAddress]

  const results = await Promise.allSettled(
    addresses.map(async (ip) => {
      try {
        updateItemLoading(ip, true)
        await fetch(ip, { signal: AbortSignal.timeout(5000), mode: "no-cors" })
        updateItemStatus(ip, true)

        return true
      } catch (err) {
        console.error("Error checking online status for", ip, err)
        updateItemStatus(ip, false)
        return false
      } finally {
        updateItemLoading(ip, false)
      }
    })
  )

  const statusByAddress: Record<string, boolean> = {}
  results.forEach((result, idx) => {
    const ip = addresses[idx]
    if (result.status === "fulfilled" && result.value === true) {
      statusByAddress[ip] = true
    } else {
      statusByAddress[ip] = false
    }
  })

  return statusByAddress
}

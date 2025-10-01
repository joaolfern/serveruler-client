import { SERVER_OPTIONS } from '../constants'

export function getCompleteAddress(address: string, selectedPort?: string) {
  if (selectedPort) {
    return `http://${address}:${selectedPort}`
  }

  const ips: string[] = []
  SERVER_OPTIONS.map((option) => {
    const port = option.value
    const ip = `http://${address}:${port}`
    ips.push(ip)
  })

  return ips
}

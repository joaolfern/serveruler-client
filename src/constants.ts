interface IServerOption {
  label: string
  value: string
}

export const SERVER_OPTIONS: Array<IServerOption> = [
  { label: 'Core', value: '3000' },
  { label: 'Indiky Server', value: '3001' },
  { label: 'Shorten', value: '3002' },
  { label: 'Nexus', value: '7000' },
  { label: 'Indiky Web', value: '4000' },
  { label: 'Auto X', value: '4010' }
]

export const COMPANY_DAYS = [0, 1, 3, 5, 6]

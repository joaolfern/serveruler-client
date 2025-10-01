import { COMPANY_DAYS } from '../constants'

export function getInitialEnvOptionIndex() {
  const weekDay = new Date().getDay()
  const isCompanyDay = COMPANY_DAYS.includes(weekDay)
  const initialOptionIndex = isCompanyDay ? 0 : 1
  return initialOptionIndex
}

import { ReactNode, createContext, useEffect, useState } from 'react'
import { getAvailableEnvs } from '../utils/getAvailableEnvs'
import { getInitialEnvOptionIndex } from '../utils/getInitialEnvOptionIndex'

export type Data = Record<string, Record<string, string>>

interface UserDataContextProps {
  data: Data
  envOptions: string[]
  selectedEnv: string
  setSelectedEnv: (env: string) => void
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({})
  const [envOptions, setEnvOptions] = useState<string[]>([])
  const [selectedEnv, setSelectedEnv] = useState<string>('')

  useEffect(() => {
    async function updateData() {
      const data = await fetchData()
      const sortedData = Object.fromEntries(
        Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
      ) as Data
      setData(sortedData)
    }

    updateData()
  }, [])

  useEffect(() => {
    if (!data) return
    const envOptions = getAvailableEnvs(data)
    setEnvOptions(envOptions)
  }, [data])

  useEffect(() => {
    const initialEnvOptionIndex = getInitialEnvOptionIndex()
    if (!selectedEnv && envOptions[initialEnvOptionIndex])
      setSelectedEnv(envOptions[initialEnvOptionIndex])
  }, [envOptions])

  return (
    <UserDataContext.Provider
      value={{
        data,
        envOptions,
        selectedEnv,
        setSelectedEnv
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

async function fetchData() {
  const response = await fetch('data.json')
  const data = await response.json()
  return data
}

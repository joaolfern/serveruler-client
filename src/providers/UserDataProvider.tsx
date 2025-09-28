import { ReactNode, createContext, useEffect, useState } from 'react'
import { SERVER_OPTIONS } from '../constants'
import { getIsCompanyDay } from '../utils/getIsCompanyDay'

type Data = Record<string, Record<string, string>>

interface UserDataContextProps {
  data: Data
  envOptions: string[]
  selectedEnv: string
  selectedServer: string | string[]
  setSelectedEnv: (env: string) => void
  setSelectedServer: (server: string | string[]) => void
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({})
  const [envOptions, setEnvOptions] = useState<string[]>([])
  const [selectedEnv, setSelectedEnv] = useState<string>('')
  const [selectedServer, setSelectedServer] = useState<string | string[]>(
    () => SERVER_OPTIONS[0].value
  )

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
        selectedServer,
        setSelectedEnv,
        setSelectedServer
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

function getAvailableEnvs(data: Data): string[] {
  const envs: string[] = []
  for (const user in data) {
    for (const env in data[user]) {
      const isNewEnv = !envs.includes(env)
      if (isNewEnv) envs.push(env)
    }
  }
  return envs
}

function getInitialEnvOptionIndex() {
  const isCompanyDay = getIsCompanyDay()
  const initialOptionIndex = isCompanyDay ? 0 : 1
  return initialOptionIndex
}

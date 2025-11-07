import { createContext } from 'react'
import { IResponse } from '../interfaces/IResponse'

interface UserDataContextProps {
  data: IResponse
  envOptions: string[]
  selectedEnv: string
  setSelectedEnv: (env: string) => void
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
)

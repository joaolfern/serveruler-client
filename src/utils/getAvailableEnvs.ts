import { Data } from '../providers/UserDataProvider'

export function getAvailableEnvs(data: Data): string[] {
  const envs: string[] = []
  for (const user in data) {
    for (const env in data[user]) {
      const isNewEnv = !envs.includes(env)
      if (isNewEnv) envs.push(env)
    }
  }
  return envs
}

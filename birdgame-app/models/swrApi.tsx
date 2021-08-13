import useSWR from 'swr'
import { TeamInterface } from './team'
import { basePath } from '../next.config'
import { UserInterface } from './user'

const fetcher = (input: RequestInfo, init: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export interface TeamsData {
  teams: TeamInterface[]
  isLoading: boolean
  isError: boolean
}

export interface UsersData {
  users: UserInterface[]
  isLoading: boolean
  isError: boolean
}

export function useTeams(): TeamsData {
  const { data, error } = useSWR(basePath + '/api/teams', fetcher)

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useUsers(teamId: string): UsersData {
  const { data, error } = useSWR(
    `${basePath}/api/teams/${teamId}/users`,
    fetcher,
  )

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  }
}

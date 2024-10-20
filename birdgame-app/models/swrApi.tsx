import useSWR from 'swr'
import { TeamInterface } from './TeamInterface'
import { basePath } from '../next.config'
import { UserInterface } from './UserInterface'

const fetcher = (input: RequestInfo | URL) =>
  fetch(input).then((res) => res.json())

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
  const { data, error } = useSWR<TeamInterface[]>(
    basePath + '/api/teams',
    fetcher,
  )

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useUsers(teamId: string): UsersData {
  const { data, error } = useSWR<UserInterface[]>(
    `${basePath}/api/teams/${teamId}/users`,
    fetcher,
  )

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  }
}

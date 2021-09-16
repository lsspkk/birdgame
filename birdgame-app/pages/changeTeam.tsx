import React, { ReactElement, useState, useContext, ChangeEvent } from 'react'
import { Button } from '../components/basic/Button'
import { Title } from '../components/basic/Title'
import { Layout } from '../components/Layout'
import { Player } from '../components/Player'
import { basePath } from '../next.config'
import { GameContextInterface, GameContext } from '../components/state'
import { useTeams } from '../models/swrApi'
import { isAnonymous } from '../models/team'

interface ChangeTeamState {
  targetTeamId?: string
  targetTeamName: string
  teamPassword: string
}
const emptyState: ChangeTeamState = {
  targetTeamId: undefined,
  targetTeamName: '',
  teamPassword: '',
}

export default function ChangeTeam(): ReactElement {
  const { user, setUser }: GameContextInterface = useContext(GameContext)
  const [state, setState] = useState<ChangeTeamState>({
    ...emptyState,
  })
  const [message, setMessage] = useState<string>('')

  const teamsData = useTeams()

  if (teamsData.isLoading) return <div />

  const myTeamName =
    user.teamId !== ''
      ? teamsData.teams.find((t) => t._id === user.teamId)?.name
      : ''
  const addTeamText =
    myTeamName !== '' ? 'Vaihda joukkue' : 'Lisää joukkueeseen'
  console.log(addTeamText, myTeamName)

  const teams = [...teamsData.teams, { name: 'Ei joukkuetta', _id: '' }]

  async function save(): Promise<void> {
    // TODO how does the save into new team work, check out the API...
    const url = isAnonymous(state.targetTeamId)
      ? `${basePath}/api/users/${user._id}`
      : `${basePath}/api/teams/${state.targetTeamId}/add/${user._id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    if (res.ok) {
      const savedPlayer = await res.json()

      setUser(savedPlayer)
      localStorage.setItem('user', JSON.stringify(savedPlayer))
      setMessage(message)
      window?.scrollTo(0, 0)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  return (
    <Layout>
      <Player user={user} />
      <div className="flex justify-between items-center">
        {myTeamName !== '' && (
          <div className="m-4 flex items-center">
            <>
              <div className="mr-4">
                <div className="text-xs">Joukkue</div>
                <Title className="pt-0">{myTeamName}</Title>
              </div>
            </>
          </div>
        )}
      </div>
      <div className="mx-4">
        {state.targetTeamId === undefined && (
          <div>
            <Title>{addTeamText}</Title>
            {teams
              .filter((t) => t._id !== user.teamId)
              .map((t) => (
                <div
                  key={`changeTeam${t._id}`}
                  className="text-gray-500 text-xl ml-4 mb-3"
                  onClick={() =>
                    setState({
                      ...state,
                      targetTeamId: t._id,
                      targetTeamName: t.name,
                    })
                  }
                >
                  {t.name}
                </div>
              ))}
          </div>
        )}
        {state.targetTeamId !== undefined && (
          <div className="pt-2 px-4 pb-10 border">
            <Title>{addTeamText}</Title>
            <Title className="text-gray-500 text-xl pt-0">
              {state.targetTeamName}
            </Title>
            {!isAnonymous(state.targetTeamId) && (
              <div className="flex items-center">
                <div className="w-20 mr-4">Joukkueen salasana</div>
                <input
                  className="p-2 border w-full"
                  type="password"
                  value={state.teamPassword}
                  name="password"
                  onChange={handleChange}
                ></input>
              </div>
            )}
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setState({ ...state, targetTeamId: undefined })}
              >
                Peruuta
              </Button>
              <Button onClick={() => save()}>{addTeamText}</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

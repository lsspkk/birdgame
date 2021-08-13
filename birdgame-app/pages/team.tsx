import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import { Button } from '../components/basic/Button'
import { Message } from '../components/basic/Message'
import { Title } from '../components/basic/Title'
import { BirdIcon } from '../components/Icons'
import { Layout } from '../components/Layout'
import { TeamSelect } from '../components/Teams'
import { getRandomBirdName } from '../data/levels'
import { TeamsData, useTeams } from '../models/swrApi'
import { TeamInterface } from '../models/team'
import { basePath } from '../next.config'

interface addTeamProps {
  setViewMode: (string) => void
}
function AddTeam({ setViewMode }: addTeamProps): ReactElement {
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [addUserPassword, setAddUserPassword] = useState<string>(
    getRandomBirdName(),
  )
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  function cancel(): void {
    setViewMode('select')
    setName('')
    setPassword('')
    setMessage('')
    setAddUserPassword(getRandomBirdName())
  }
  async function save(): Promise<void> {
    if (password !== passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const newTeam: TeamInterface = { name, password, addUserPassword }
    const res = await fetch(`${basePath}/api/teams`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeam),
    })
    if (res.ok) {
      router.reload()
    }
  }
  return (
    <div>
      <Title>Lisää joukkue</Title>
      <p>
        Sinusta tulee admin, joka voi hallinnoida joukkuetta, poistaa pelaajia
        jne.
      </p>
      <p className="pt-4">
        Valitse lisäyskoodi eli linnun nimi joukkueelle ja kerro se
        kavereillesi. Sen avulla he voivat lisätä itsensä joukkueeseen.
      </p>

      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Nimi:</div>
        <input
          className="p-2 border"
          type="text"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        ></input>
      </div>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Salasana:</div>
        <input
          className="p-2 border"
          type="text"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        ></input>
      </div>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">
          Salasana
          <br />
          uudestaan:
        </div>
        <input
          className="p-2 border"
          type="text"
          value={passwordConfirm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPasswordConfirm(event.target.value)
          }
        ></input>
      </div>
      <div className="flex items-center pt-20">
        <div className="w-20 mr-4">Lisäyskoodi</div>
        <input
          className="p-2 border"
          type="text"
          value={addUserPassword}
          disabled={true}
        ></input>
        <div
          className="ml-1 p-2 border bg-gray-200 shadow"
          onClick={() => setAddUserPassword(getRandomBirdName())}
        >
          Vaihda
        </div>
      </div>

      {message !== '' && <Message>{message}</Message>}
      <div className="flex w-full md:w-1/2 justify-around pt-20">
        <Button onClick={() => cancel()}>Peruuta</Button>
        <Button onClick={() => save()}>Lisää</Button>
      </div>
    </div>
  )
}

export default function Group(): ReactElement {
  const teamsData: TeamsData = useTeams()
  const [viewMode, setViewMode] = useState<string>('select')

  return (
    <Layout>
      <Link href="/">
        <h1 className="text-6xl font-bold">
          <BirdIcon />
        </h1>
      </Link>
      {viewMode === 'add' && <AddTeam setViewMode={setViewMode} />}
      {viewMode === 'select' && (
        <>
          <div className="flex w-full md:w-1/2 justify-between mb-20 items-center">
            <Title>Joukkueet</Title>
            <Button onClick={() => setViewMode('add')}>Lisää</Button>
          </div>
          {teamsData.isLoading === true && (
            <Message>Ladataan joukkueita</Message>
          )}
          {teamsData.isError !== undefined && (
            <Message>
              Virhe ladattaessa joukkueita {JSON.stringify(teamsData.isError)}
            </Message>
          )}
          {teamsData.teams !== undefined &&
            teamsData.teams.map((team: TeamInterface) => (
              <TeamSelect key={`teamselect${team._id}`} team={team} />
            ))}
        </>
      )}
    </Layout>
  )
}

import React, { ReactElement, useState } from 'react'
import { Button } from '../../components/basic/Button'
import { Message } from '../../components/basic/Message'
import { Title } from '../../components/basic/Title'
import { Layout } from '../../components/Layout'
import { TeamSelect } from './TeamSelect'
import { TeamsData, useTeams } from '../../models/swrApi'
import { TeamInterface } from '../../models/team'
import { AddTeam } from './AddTeam'

export default function Group(): ReactElement {
  const teamsData: TeamsData = useTeams()
  const [viewMode, setViewMode] = useState<string>('select')

  const anonymousTeam: TeamInterface = {
    id: '',
    name: 'Joukkueettomat pelaajat',
    password: '',
    addUserPassword: '',
  }

  return (
    <Layout>
      {viewMode === 'add' && <AddTeam setViewMode={setViewMode} />}
      {viewMode === 'select' && (
        <>
          <div className="flex w-full md:w-1/2 justify-between mb-20 items-center px-4">
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

          {teamsData.isLoading !== true && teamsData.isError === undefined && (
            <TeamSelect team={anonymousTeam} />
          )}
        </>
      )}
    </Layout>
  )
}

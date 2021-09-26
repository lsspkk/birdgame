import React, { ReactElement, useState } from 'react'
import { Button } from '../components/basic/Button'
import { Message } from '../components/basic/Message'
import { Title } from '../components/basic/Title'
import { Layout } from '../components/Layout'
import { TeamCard } from '../components/team/TeamCard'
import { TeamsData, useTeams } from '../models/swrApi'
import { TeamInterface } from '../models/team'
import { AddTeam } from '../components/team/AddTeam'
import { EditTeam } from '../components/team/EditTeam'

export interface GroupViewMode {
  view: string
  teamToEdit?: TeamInterface
}
export default function Group(): ReactElement {
  const teamsData: TeamsData = useTeams()
  const [viewMode, setViewMode] = useState<GroupViewMode>({
    view: 'select',
  })

  return (
    <Layout>
      {viewMode.view === 'add' && <AddTeam setViewMode={setViewMode} />}
      {viewMode.view === 'edit' && (
        <EditTeam setViewMode={setViewMode} team={viewMode.teamToEdit} />
      )}
      {viewMode.view === 'select' && (
        <>
          <div className="flex w-full md:w-1/2 justify-between mb-20 items-center px-4">
            <Title>Joukkueet</Title>
            <Button onClick={() => setViewMode({ view: 'add' })}>Lisää</Button>
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
              <TeamCard
                key={`teamselect${team._id}`}
                team={team}
                setViewMode={setViewMode}
              />
            ))}
        </>
      )}
    </Layout>
  )
}

import React, { ReactElement, useContext, useState } from 'react'
import { Button } from '../components/basic/Button'
import { Message } from '../components/basic/Message'
import { Title } from '../components/basic/Title'
import { Layout } from '../components/Layout'
import { TeamCard } from '../components/team/TeamCard'
import { TeamsData, useTeams } from '../models/swrApi'
import { TeamInterface } from '../models/TeamInterface'
import { AddTeam } from '../components/team/AddTeam'
import { EditTeam } from '../components/team/EditTeam'
import { UnknownUserIcon } from '../components/Icons'
import { GameContext } from '../components/state'
import { emptyUser } from '../models/UserInterface'
import { useRouter } from 'next/router'
import { emptyScore } from '../models/ScoreInterface'
import { AddTeamConfirm } from '../components/team/AddTeamConfirm'

export interface GroupViewMode {
  view: string
  teamToEdit?: TeamInterface
}
export default function Group(): ReactElement {
  const { setUser, setScore } = useContext(GameContext)
  const teamsData: TeamsData = useTeams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<GroupViewMode>({
    view: 'select',
  })

  function onSelectEmptyUser() {
    localStorage.removeItem('user')
    setUser(emptyUser)
    setScore(emptyScore)
    router.push('/')
  }

  return (
    <Layout>
      {viewMode.view === 'add' && <AddTeam setViewMode={setViewMode} />}
      {viewMode.view === 'confirm' && (
        <AddTeamConfirm setViewMode={setViewMode} />
      )}
      {viewMode.view === 'edit' && (
        <EditTeam setViewMode={setViewMode} team={viewMode.teamToEdit} />
      )}
      {viewMode.view === 'select' && (
        <>
          <div className="flex w-full md:w-1/2 justify-between mb-10 items-center px-4">
            <Title>Valitse Joukkue/Pelaaja</Title>
            <Button onClick={() => setViewMode({ view: 'confirm' })}>
              Lisää
            </Button>
          </div>

          <div className="flex w-full items-center" onClick={onSelectEmptyUser}>
            <UnknownUserIcon className="w-20 mr-4" />
            <div>Nimetön</div>
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

import React, { ReactElement, useContext, useState } from 'react'
import { TeamInterface } from '../../models/team'
import { Button } from '../basic/Button'
import { GameContext } from '../state'
import { DownArrow, EditIcon, UpArrow } from '../Icons'
import { TeamPlayerList } from './TeamPlayerList'
import { EditTeamDialog } from './EditTeamDialog'
import { GroupViewMode } from '../../pages/team'

export interface TeamCardProps {
  team: TeamInterface
  setViewMode: (GroupViewMode) => void
}
interface TeamCardState {
  isOpen: boolean
  isAskingEditPassword: boolean
}
export function TeamCard({ team, setViewMode }: TeamCardProps): ReactElement {
  const { user } = useContext(GameContext)

  const [state, setState] = useState<TeamCardState>({
    isOpen: user.teamId === team._id,
    isAskingEditPassword: false,
  })
  return (
    <div className="border p-4">
      <div className="flex w-full justify-between">
        <div
          className="flex-grow text-red-900 font-bold py-2 rounded  text-2xl"
          onClick={() => setState({ ...state, isOpen: !state.isOpen })}
        >
          {team.name}
        </div>
        {!state.isAskingEditPassword && (
          <Button
            className="mr-2 justify-self-end"
            onClick={() => setState({ ...state, isAskingEditPassword: true })}
          >
            <EditIcon />
          </Button>
        )}
        {!state.isOpen && (
          <Button onClick={() => setState({ ...state, isOpen: true })}>
            <DownArrow />
          </Button>
        )}
        {state.isOpen && (
          <Button onClick={() => setState({ ...state, isOpen: false })}>
            <UpArrow />
          </Button>
        )}
      </div>
      {state.isOpen && (
        <div>
          <TeamPlayerList team={team} setViewMode={setViewMode} />
        </div>
      )}
      {state.isAskingEditPassword && (
        <EditTeamDialog
          team={team}
          close={() => setState({ ...state, isAskingEditPassword: false })}
          setViewMode={(viewMode: GroupViewMode) => {
            setState({
              ...state,
              isAskingEditPassword: false,
            })
            setViewMode({ ...viewMode })
          }}
        />
      )}
    </div>
  )
}

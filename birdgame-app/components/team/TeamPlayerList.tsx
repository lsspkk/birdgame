import React, { ReactElement, useContext, useState } from 'react'
import { UsersData, useUsers } from '../../models/swrApi'
import { UserInterface } from '../../models/user'
import { Button } from '../basic/Button'
import { Title } from '../basic/Title'
import { GameContext, GameContextInterface } from '../state'
import { Player } from '../Player'
import { TeamCardProps } from './TeamCard'
import { AddTeamPlayer } from './AddTeamPlayer'
import { SelectUserDialog } from './SelectUserDialog'

export function TeamPlayerList({ team }: TeamCardProps): ReactElement {
  const [show, setShow] = useState<boolean>(false)
  const [passwordDialogUser, setPasswordDialogUser] = useState<string>('')
  const data: UsersData = useUsers(team._id)
  const { user }: GameContextInterface = useContext(GameContext)

  if (data.isLoading) return <div />

  if (data.isError) return <div>Virhe ladattaessa pelaajia</div>

  // TODO ask for password when changin player
  return (
    <div>
      <Title>Pelaajat</Title>

      <div className="flex items-center">
        {!show && (
          <>
            {data.users.length === 0 && (
              <div className="pr-4">Ei pelaajia joukkueessa</div>
            )}

            {data.users.map((u: UserInterface) => (
              <div
                key={`selectUser${u._id}`}
                onClick={() => {
                  if (user._id === u._id) {
                    setPasswordDialogUser('')
                  } else if (passwordDialogUser === '') {
                    setPasswordDialogUser(u._id)
                  }
                }}
              >
                <Player user={u} />
                {u._id === passwordDialogUser && (
                  <SelectUserDialog
                    user={u}
                    close={() => setPasswordDialogUser('')}
                  />
                )}
              </div>
            ))}
            {
              <Button className="ml-8" onClick={() => setShow(!show)}>
                Lisää
              </Button>
            }
          </>
        )}
        {show && <AddTeamPlayer team={team} setShow={setShow} />}
      </div>
    </div>
  )
}

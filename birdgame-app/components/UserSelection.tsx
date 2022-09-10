import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './state'
import { Player } from './Player'
import { ProfileIcon, SettingsIcon, TeamIcon } from './Icons'

function UserSelectionController(): ReactElement {
  const { user }: GameContextInterface = useContext(GameContext)
  const router = useRouter()

  // TODO change user password
  // TODO change team password/join codeword/admin team players/admins
  return (
    <div className="flex w-full md:w-full items-center justify-between top-border pb-5">
      <Player user={user} />
      {user._id !== undefined && (
        <div className="flex flex-col items-center">
          <ProfileIcon
            className="h-20 w-40"
            onClick={() => router.push('/profile')}
          />
          <div>Tiedot</div>
        </div>
      )}

      <div>
        <TeamIcon className="h-20 w-40" onClick={() => router.push('/team')} />
        <div>Valitse joukkue/pelaaja</div>
      </div>
      <div className="flex flex-col items-center opacity-50">
        <SettingsIcon
          className="h-20 w-20"
          onClick={() => router.push('/settings')}
        />
        <div>Asetukset</div>
      </div>
    </div>
  )
}

export { UserSelectionController }

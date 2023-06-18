import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './state'
import { Player } from './Player'
import { ProfileIcon, SettingsIcon, TeamIcon } from './Icons'

function UserSelectionController(): ReactElement {
  const { user }: GameContextInterface = useContext(GameContext)
  const router = useRouter()

  const onProfileClick = () => {
    if (user._id !== undefined) {
      router.push('/profile')
    }
  }
  // TODO change user password
  // TODO change team password/join codeword/admin team players/admins
  return (
    <div className="flex w-full md:w-full items-end justify-between top-border pb-5 flex-wrap">
      <div className="flex items-end" onClick={onProfileClick}>
        <Player user={user} />
        {
          <div className="flex flex-col items-center -ml-2">
            <ProfileIcon className="h-10 w-20" />
            <div>Tiedot</div>
          </div>
        }
      </div>

      <div>
        <TeamIcon className="h-20 w-40" onClick={() => router.push('/team')} />
        <div>Valitse joukkue/pelaaja</div>
      </div>
    </div>
  )
}

export { UserSelectionController }

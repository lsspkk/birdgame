import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './state'
import { Player } from './Player'
import { ProfileIcon } from './Icons'

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
    <div className="flex gap-8 w-full md:w-full items-end justify-between top-border pb-5 flex-wrap">
      <div
        className="flex w-full mx-4 justify-between items-end"
        onClick={onProfileClick}
      >
        <Player user={user} />
        {
          <div className="flex flex-col items-center -ml-2">
            <ProfileIcon className="h-10 w-20" />
            <div>Tiedot</div>
          </div>
        }
      </div>
    </div>
  )
}

export { UserSelectionController }

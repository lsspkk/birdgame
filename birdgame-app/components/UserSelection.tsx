import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { Button } from './basic/Button'
import { GameContext, GameContextInterface } from './state'
import { Player } from './Player'

function UserSelectionController(): ReactElement {
  const { user }: GameContextInterface = useContext(GameContext)
  const router = useRouter()

  // TODO change user password
  // TODO change team password/join codeword/admin team players/admins
  return (
    <div className="flex w-full md:w-full items-center justify-between top-border pb-5">
      <Player user={user} />
      <div></div>
      {user._id !== undefined && (
        <Button className="lg:ml-40" onClick={() => router.push('/profile')}>
          Omat tiedot
        </Button>
      )}
      <Button onClick={() => router.push('/team')}>Joukkue/Pelaajat</Button>
      {user._id === undefined && (
        <div>Valitse joukkue/pelaaja jos haluat tallentaa kehityksesi</div>
      )}
    </div>
  )
}

export { UserSelectionController }

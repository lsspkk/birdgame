import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './ContextWrapper'
import { BirdIconNoSound } from './Icons'

interface ImageLevelButtonProps {
  level: string
  onClick?: () => void
}
export function ImageLevelButton({
  level,
}: ImageLevelButtonProps): ReactElement {
  const { setBirdKnowledge }: GameContextInterface = useContext(GameContext)
  const router = useRouter()
  function selectLevel() {
    // store answers of this game
    setBirdKnowledge([])
    router.push(`/imagelevel/${level}`)
  }
  return (
    <div className="w-1/3 bg-red-200 p-4">
      <div onClick={selectLevel}>
        <BirdIconNoSound />
        {level}
      </div>
    </div>
  )
}

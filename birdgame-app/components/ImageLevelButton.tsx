import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './state'
import { BirdIconNoSound } from './Icons'
import { useStars } from './StarCircle'

interface ImageLevelButtonProps {
  level: string
  onClick?: () => void
}
export function ImageLevelButton({
  level,
}: ImageLevelButtonProps): ReactElement {
  const { setBirdKnowledge, score }: GameContextInterface =
    useContext(GameContext)
  const router = useRouter()
  const stars = useStars(score, level)
  function selectLevel() {
    // store answers of this game
    setBirdKnowledge([])
    router.push(`/imagelevel/${level}`)
  }
  return (
    <div
      className={`w-1/2 bg-red-${100 * (Number(level) + 1)} px-1 py-4 border-4`}
    >
      <div onClick={selectLevel} className="flex items-center justify-center">
        <div className="absolute -ml-28">
          <BirdIconNoSound />
        </div>
        <div className="opacity-0 pr-2">1</div>
        {stars !== undefined && stars}
        <div className="text-white font-bold text-2xl pl-2">{level}</div>
      </div>
      {/* <span className="bg-red-200">.</span>
      <span className="bg-red-300">.</span>
      <span className="bg-red-400">.</span>
      <span className="bg-red-500">.</span>
      <span className="bg-red-600">.</span> */}
    </div>
  )
}

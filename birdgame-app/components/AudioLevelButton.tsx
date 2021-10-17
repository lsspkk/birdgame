import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from './state'
import { BirdIcon } from './Icons'
import { useStars } from './StarCircle'

interface AudioLevelButtonProps {
  level: string
  onClick?: () => void
}
export function AudioLevelButton({
  level,
}: AudioLevelButtonProps): ReactElement {
  const { setBirdKnowledge, score }: GameContextInterface =
    useContext(GameContext)
  const router = useRouter()
  // TODO fix the data model, save scores for image and audio separately
  const stars = useStars(score, Number(level))
  function selectLevel() {
    // store answers of this game
    setBirdKnowledge([])
    router.push(`/audiolevel/${level}`)
  }
  return (
    <div
      className={`w-1/2 bg-indigo-${
        100 * (Number(level) + 1)
      } px-1 py-4 border-4`}
    >
      <div onClick={selectLevel} className="flex items-center justify-center">
        <div className="absolute -ml-28">
          <BirdIcon />
        </div>
        <div className="opacity-0 pr-2">1</div>
        <div className="w-2 h-20"></div>
        {/* {stars !== undefined && stars} */}
        <div className="text-white font-bold text-2xl pl-2">{level}</div>
      </div>
      {/* <span className="bg-indigo-200">.</span>
      <span className="bg-indigo-300">.</span>
      <span className="bg-indigo-400">.</span>
      <span className="bg-indigo-500">.</span>
      <span className="bg-indigo-600">.</span> */}
    </div>
  )
}

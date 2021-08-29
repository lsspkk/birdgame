import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext } from 'react'
import { GameContext, GameContextInterface } from '../components/state'
import { getBird } from '../data/levels'
import { IBirdKnowledge } from '../models/score'

function BirdKnowledgeImage({
  knowledge,
}: {
  knowledge: IBirdKnowledge
}): ReactElement {
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL

  const spinTime = 5 + 20 * Math.random()
  const clockWise = Math.random() > 0.5
  const flyTime = 20 + 20 * Math.random()

  return (
    <>
      <style jsx>
        {`
          @keyframes spin {
            100% {
              transform: rotate(${clockWise ? '' : '-'}360deg);
            }
          }

          @keyframes fly {
            98.001%,
            0% {
              display: block;
              transform: translateX(-200%) translateY(100vh) rotateZ(0deg);
            }

            15% {
              transform: translateX(100vw) translateY(-100%) rotateZ(180deg);
            }

            15.001%,
            18% {
              transform: translateX(100vw) translateY(-30%) rotateZ(0deg);
            }

            40% {
              transform: translateX(-200%) translateY(3vh) rotateZ(-180deg);
            }

            40.001%,
            43% {
              transform: translateX(-200%) translateY(-100%) rotateZ(-180deg);
            }

            65% {
              transform: translateX(100vw) translateY(50vh) rotateZ(0deg);
            }

            65.001%,
            68% {
              transform: translateX(20vw) translateY(-200%) rotateZ(180deg);
            }

            95% {
              transform: translateX(10vw) translateY(100vh) rotateZ(0deg);
            }
          }

          div {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            position: relative;
            overflow: hidden;
            animation: fly ${flyTime}s linear infinite;
          }
          img {
            object-fit: cover;
            animation: spin ${spinTime}s linear infinite;
            height: 100%;
            width: 100%;
          }
        `}
      </style>
      <div>
        <img src={url + getBird(knowledge.bird).image} />
      </div>
    </>
  )
}

export default function Knowledge(): ReactElement {
  const { score }: GameContextInterface = useContext(GameContext)
  const router = useRouter()

  return (
    <div
      className="w-full h-full bg-black text-white"
      onClick={() => router.push('/')}
    >
      {score?.knowledge.map((k) => (
        <BirdKnowledgeImage knowledge={k} key={`bk${k.bird}`} />
      ))}
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { BirdIcon } from '../components/Icons'
import { GameContext, GameContextInterface } from '../components/state'
import { getBird } from '../data/levels'
import { IBirdKnowledge } from '../models/ScoreInterface'
import { Bird } from '../data/levels'

function BirdKnowledgeImage({
  knowledge,
}: {
  knowledge: IBirdKnowledge
}): ReactElement {
  const bird = getBird(knowledge.bird)

  useEffect(() => {
    return () => console.log('bye')
  })

  return (
    <tr>
      <td>
        <AnimatedBird bird={bird} />
      </td>
      <td className="text-center text-2xl text-bold">
        {knowledge.answers
          .filter((a) => a.answerType === 'image')
          .map((a) => (
            <div key={`dk${bird.name}.${a.answerType}`}>
              {/* {a.answerType === 'image' ? 'Kuva' : 'Ääni'} */}
              <div className="text-sm">{bird.name}</div>
              <div className="bg-green-900 inline">{a.right}</div> /{' '}
              <div className="bg-red-900 inline">{a.wrong}</div>
            </div>
          ))}
      </td>
    </tr>
  )
}

export default function Knowledge(): ReactElement {
  const { score }: GameContextInterface = useContext(GameContext)
  const [order, setOrder] = useState('known')
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-row align-center justify-center flex-wrap gap-2">
      <div className="w-full mx-2 mt-2">
        <input
          type="radio"
          name="order"
          id="known"
          value="known"
          checked={order === 'known'}
          onChange={() => setOrder('known')}
        />
        <label htmlFor="known">Hyvin tunnetut ensin {order}</label>
      </div>
      <div className="w-full mx-2">
        <input
          type="radio"
          name="order"
          id="unknown"
          value="unknown"
          checked={order === 'unknown'}
          onChange={() => setOrder('unknown')}
        />
        <label htmlFor="unknown">Huonosti tunnetut ensin</label>
      </div>
      <table>
        <tbody>
          <tr>
            <th onClick={() => router.push('/')}>
              <BirdIcon />
            </th>
            <th>
              Kuvantunnistus
              <br />
              Oikein/Väärin
            </th>
          </tr>
          {score?.knowledge.sort(knowledgeNumberSorter).map((k) => (
            <BirdKnowledgeImage knowledge={k} key={`bk${k.bird}`} />
          ))}
        </tbody>
      </table>
    </div>
  )

  function knowledgeNumberSorter(a: IBirdKnowledge, b: IBirdKnowledge) {
    const { aKnowledge, bKnowledge } = extractKnowledgeNumber(a, b, 'image')
    return order === 'unknown'
      ? aKnowledge - bKnowledge
      : bKnowledge - aKnowledge
  }
}

function extractKnowledgeNumber(
  a: IBirdKnowledge,
  b: IBirdKnowledge,
  answerType: string,
) {
  const aImage = a.answers.filter((a) => a.answerType === answerType)[0]

  const bImage = b.answers.filter((b) => b.answerType === answerType)[0] || {
    right: 0,
    wrong: 0,
  }

  const aKnowledge = aImage.right - aImage.wrong
  const bKnowledge = bImage.right - bImage.wrong
  return { aKnowledge, bKnowledge }
}

function AnimatedBird({ bird }: { bird: Bird }): ReactElement {
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL

  const spinTime = 5 + 20 * Math.random()
  const clockWise = Math.random() > 0.5
  const flyTime = 20 + 20 * Math.random()

  function randomColor() {
    return Math.round(50 + Math.random() * 200)
  }
  const colors = [randomColor(), randomColor(), randomColor()]
  const rgb = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`

  const [playing, setPlayint] = useState<boolean>(false)

  function toggleAudio() {
    const audioElement = document.querySelector(
      `.${bird.name}`,
    ) as HTMLAudioElement
    if (playing) {
      audioElement.pause()
      setPlayint(false)
    } else {
      audioElement.play()
      setPlayint(true)
    }
  }

  return (
    <React.Fragment>
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

          .imagewrapper {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            position: relative;
            overflow: hidden;
            /* animation: fly ${flyTime}s linear infinite; */
          }
          img {
            object-fit: cover;
            animation: spin ${spinTime}s linear infinite;
            height: 100%;
            width: 100%;
          }
          .playing {
            border: 10px solid ${rgb};
            box-shadow: 0px 0px 5px ${rgb}, 0px 0px 5px ${rgb};
          }
        `}
      </style>

      <audio src={url + bird.audio} className={`hidden ${bird.name}`} />
      <div
        className={`imagewrapper ${playing ? 'playing' : ''}`}
        onClick={toggleAudio}
      >
        <img
          src={url + bird.image}
          alt={bird.name}
          width="100%"
          height="auto"
        />
      </div>
    </React.Fragment>
  )
}

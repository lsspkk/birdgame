/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { BirdIcon } from '../components/Icons'
import { GameContext, GameContextInterface } from '../components/state'
import { getBird } from '../data/levels'
import { IBirdKnowledge } from '../models/IGameResult'

function BirdKnowledgeImage({
  knowledge,
}: {
  knowledge: IBirdKnowledge
}): ReactElement {
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL
  const bird = getBird(knowledge.bird)
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

  useEffect(() => {
    return () => console.log('bye')
  })

  return (
    <tr>
      <td>
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
            alt={knowledge.bird}
            width="100%"
            height="auto"
          />
        </div>
      </td>
      <td className="text-center text-2xl text-bold">
        {knowledge.answers
          .filter((a) => a.answerType === 'image')
          .map((a) => (
            <div key={`dk${bird.name}.${a.answerType}`}>
              {/* {a.answerType === 'image' ? 'Kuva' : 'Ääni'} */}
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
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-black text-white flex align-center justify-center">
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
          {score?.knowledge.map((k) => (
            <BirdKnowledgeImage knowledge={k} key={`bk${k.bird}`} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

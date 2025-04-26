/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { BirdIcon, CloseIcon, SortOrderIcon } from '../components/Icons'
import { GameContext, GameContextInterface } from '../components/state'
import { getBird, Bird } from '../data/levels'
import { IBirdKnowledge } from '../models/ScoreInterface'
import useWindowDimensions from '../components/useWindowDimensions'
import SortOrderDialog, { OrderType } from '../components/SortOrderDialog'
import { RoundButton } from '../components/basic/RoundButton'

function BirdKnowledgeImage({
  knowledge,
  order,
}: {
  knowledge: IBirdKnowledge
  order: OrderType
}): ReactElement {
  const bird = getBird(knowledge.bird)

  useEffect(() => {
    return () => console.log('bye')
  })

  return (
    <tr className="">
      <td className="pb-2 pr-2 sm:pr-4 sm:pb-4 md:pr-6 md:pr-10">
        <AnimatedBird bird={bird} />
      </td>
      <td className="mt-6 text-center text-2xl text-bold flex flex-col gap-2">
        <div className="text-xl sm:text-2xl md:text-3xl uppercase tracking-widest ">
          {bird.name}
        </div>
        <div className="flex flex-row gap-8 justify-center">
          {knowledge.answers
            .filter((a) => a.answerType === 'image')
            .map((a) => (
              <div key={`dk${bird.name}.${a.answerType}`}>
                <span className="text-green-500 inline">{a.right}</span> /{' '}
                <span className="text-red-500 inline">{a.wrong}</span>
              </div>
            ))}
          {knowledge.answers
            .filter((a) => a.answerType === 'audio')
            .map((a) => (
              <div key={`dk${bird.name}.${a.answerType}`}>
                <div className="text-green-500 inline">{a.right}</div> /{' '}
                <div className="text-red-500 inline">{a.wrong}</div>
              </div>
            ))}
        </div>
      </td>
    </tr>
  )
}

function RadioInput({
  value,
  current,
  onChange,
  label,
}: {
  value: string
  current: string
  label: string
  onChange: (order: string) => void
}): ReactElement {
  return (
    <div className="flex flex-row gap-2">
      <input
        type="radio"
        name="order"
        id={value}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
      />
      <label htmlFor={value}>{label}</label>
    </div>
  )
}

export default function Knowledge(): ReactElement {
  const { score }: GameContextInterface = useContext(GameContext)
  const [order, setOrder] = useState<OrderType>('image-known')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col align-center justify-center flex-wrap gap-2">
      <div className="flex flex-row items-center gap-4 w-full">
        <CloseIcon
          className="absolute right-0 top-0 h-10 w-10"
          onClick={() => router.back()}
        />
        <RoundButton className="" onClick={() => setDialogOpen(true)}>
          <SortOrderIcon />
        </RoundButton>
        <SortOrderDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          order={order}
          setOrder={(o) => {
            setOrder(o)
            setDialogOpen(false)
          }}
        />
      </div>
      <div className="max-w-sm mx-auto w-full">
        <table className="w-full">
          <tbody>
            <tr>
              <th onClick={() => router.push('/')}>
                <BirdIcon />
              </th>
              <th>Oikein/Väärin</th>
            </tr>
            {score?.knowledge.sort(knowledgeNumberSorter).map((k) => (
              <BirdKnowledgeImage
                knowledge={k}
                key={`bk${k.bird}`}
                order={order}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  function knowledgeNumberSorter(a: IBirdKnowledge, b: IBirdKnowledge) {
    const aTotal = extractTotalKnowledge(a)
    const bTotal = extractTotalKnowledge(b)

    if (order === 'image-known') {
      return bTotal.imageTotal - aTotal.imageTotal
    }
    if (order === 'image-unknown') {
      return aTotal.imageTotal - bTotal.imageTotal
    }
    if (order === 'audio-known') {
      return bTotal.audioTotal - aTotal.audioTotal
    }

    return aTotal.audioTotal - bTotal.audioTotal
  }
}

function extractTotalKnowledge(a: IBirdKnowledge) {
  const iAnswer = a.answers.filter((a) => a.answerType === 'image')?.[0] || {
    right: 0,
    wrong: 0,
  }
  const aAnswer = a.answers.filter((a) => a.answerType === 'audio')?.[0] || {
    right: 0,
    wrong: 0,
  }
  const audioTotal = aAnswer.right - aAnswer.wrong
  const imageTotal = iAnswer.right - iAnswer.wrong
  return { imageTotal, audioTotal }
}

function AnimatedBird({ bird }: { bird: Bird }): ReactElement {
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL
  const { width } = useWindowDimensions()

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
            width: ${width > 500 ? '150px' : '100px'};
            height: ${width > 500 ? '150px' : '100px'};
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
          height="auto"
          className="w-40"
        />
      </div>
    </React.Fragment>
  )
}

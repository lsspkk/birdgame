/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { BirdIcon, BirdIconNoSound, CloseIcon } from '../components/Icons'
import { GameContext, GameContextInterface } from '../components/state'
import { getBird } from '../data/levels'
import { IBirdKnowledge } from '../models/ScoreInterface'
import { Bird } from '../data/levels'
import useWindowDimensions from '../components/useWindowDimensions'

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
  const [order, setOrder] = useState('image-known')
  const router = useRouter()

  return (
    <div className="w-full min-h-screen bg-gray-800 text-white flex flex-row align-center justify-center flex-wrap gap-2">
      <CloseIcon
        className="h-10 w-10 fixed top-2 right-2"
        onClick={() => router.back()}
      />

      <div className="w-8/12 sm:w-full flex flex-col items-center gap-2">
        <div className="mx-2 mt-2 flex flex-row gap-2 sm:gap-6 flex-wrap ">
          <RadioInput
            value="image-known"
            current={order}
            onChange={setOrder}
            label="Kuva +"
          />
          <RadioInput
            value="image-unknown"
            current={order}
            onChange={setOrder}
            label="Kuva -"
          />
        </div>
        <div className="mx-2 mt-2 flex flex-row gap-2 sm:gap-6 flex-wrap sm:flex">
          <RadioInput
            value="audio-known"
            current={order}
            onChange={setOrder}
            label="Ääni +"
          />
          <RadioInput
            value="audio-unknown"
            current={order}
            onChange={setOrder}
            label="Ääni -"
          />
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 justify-between items-end">
                <div>
                  <BirdIconNoSound />
                  Kuva
                </div>
                <div>Tunnistus</div>
                <div>
                  <BirdIcon />
                  Ääni
                </div>
              </div>
            </th>
          </tr>
          {score?.knowledge
            .sort(knowledgeNumberSorter)
            .map((k) => (
              <BirdKnowledgeImage knowledge={k} key={`bk${k.bird}`} />
            ))}
        </tbody>
      </table>
    </div>
  )

  function knowledgeNumberSorter(a: IBirdKnowledge, b: IBirdKnowledge) {
    const {
      aImageKnowledge,
      bImageKnowledge,
      aAudioKnowledge,
      bAudioKnowledge,
    } = extractKnowledgeNumbers(a, b)
    if (order === 'image-unknown') {
      return aImageKnowledge - bImageKnowledge
    }
    if (order === 'audio-unknown') {
      return aAudioKnowledge - bAudioKnowledge
    }
    if (order === 'image-known') {
      return bImageKnowledge - aImageKnowledge
    }
    if (order === 'audio-known') {
      return bAudioKnowledge - aAudioKnowledge
    }
  }
}

function extractKnowledgeNumbers(a: IBirdKnowledge, b: IBirdKnowledge) {
  const aImage = extractSingleKnowledge(a, 'image')
  const bImage = extractSingleKnowledge(b, 'image')
  const aImageKnowledge = aImage.right - aImage.wrong
  const bImageKnowledge = bImage.right - bImage.wrong
  const aAudio = extractSingleKnowledge(a, 'audio')
  const bAudio = extractSingleKnowledge(b, 'audio')
  const aAudioKnowledge = aAudio.right - aAudio.wrong
  const bAudioKnowledge = bAudio.right - bAudio.wrong

  return { aImageKnowledge, bImageKnowledge, aAudioKnowledge, bAudioKnowledge }
}

function extractSingleKnowledge(k: IBirdKnowledge, kType: 'image' | 'audio') {
  return (
    k.answers.filter((a) => a.answerType === kType)[0] || { right: 0, wrong: 0 }
  )
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
            box-shadow:
              0px 0px 5px ${rgb},
              0px 0px 5px ${rgb};
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

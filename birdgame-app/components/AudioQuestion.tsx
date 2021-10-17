/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, useEffect, useState } from 'react'

import { getBird, Question } from '../data/levels'

interface AudioQuestionProps {
  question: Question
  answer: (string) => void
  questionIndex: number
}
function AudioQuestion({
  question,
  answer,
  questionIndex,
}: AudioQuestionProps): ReactElement {
  const [playing, setPlayint] = useState<boolean>(false)

  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL
  if (url === undefined) {
    console.log(
      'Error, missing environment variable: NEXT_PUBLIC_BIRDIMAGE_URL',
    )
  }
  const isPortrait = typeof window === 'undefined' || window.innerHeight > 800

  // use nice ratio for landscape screen
  const birdCardMaxWidth = isPortrait
    ? '600px'
    : `${window.innerHeight / 2.2}px`
  const birdCardMaxHeight = isPortrait ? '30%' : '50%'

  const birdCardWidth = question.choises.length <= 4 ? 'w-full' : 'w-1/2'

  function toggleAudio() {
    const audioElement = document.querySelector(
      '.birdaudio',
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
    const handle = setTimeout(() => toggleAudio(), 500)
    return () => clearTimeout(handle)
  }, [])

  const bird = getBird(question.choises[question.rightAnswer])
  return (
    <div className="bg-gray-800 h-full">
      <div
        className="text-xl absolute bg-white bg-opacity-50 p-1"
        onClick={() => toggleAudio()}
      >
        Lintu {playing ? 'laulaa ||' : 'ei laula |>'}
        <audio src={url + bird.audio} className="birdaudio" />
      </div>
      <div className="flex flex-col flex-wrap items-start justify-start h-screen w-screen">
        {question.choises.map((a, i) => (
          <div
            className={`p-2 flex-shrink-1 self-center ${birdCardWidth}`}
            style={{ maxWidth: birdCardMaxWidth, maxHeight: birdCardMaxHeight }}
            key={`qa${questionIndex}-${i}-${JSON.stringify(question)}`}
          >
            <img
              width="100%"
              height="100%"
              className="w-full h-full"
              onClick={() => {
                answer(i)
              }}
              src={url + getBird(a).image}
              alt="salaisuus, arvaa mikä lintu"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { AudioQuestion }

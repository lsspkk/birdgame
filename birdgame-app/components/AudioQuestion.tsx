/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, useEffect, useState } from 'react'

import { getBird, Question } from '../data/levels'
import { AnswerGrid } from './AnswerGrid'

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

  const toggleAudio = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bird = getBird(question.choises[question.rightAnswer])

  return (
    <AnswerGrid
      answer={answer}
      question={question}
      questionIndex={questionIndex}
      header={
        <div
          className="text-xl absolute bg-white bg-opacity-50 p-1"
          onClick={() => toggleAudio()}
        >
          Lintu {playing ? 'laulaa ||' : 'ei laula |>'}
          <audio src={url + bird.audio} className="birdaudio" />
        </div>
      }
    />
  )
}

export { AudioQuestion }

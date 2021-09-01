import React, { ReactElement } from 'react'

import { getBird, Question } from '../data/levels'

interface ImageQuestionProps {
  question: Question
  answer: (string) => void
  questionIndex: number
}
function ImageQuestion({
  question,
  answer,
  questionIndex,
}: ImageQuestionProps): ReactElement {
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
  return (
    <div className="bg-gray-800 h-full">
      <div className="text-xl absolute bg-white bg-opacity-50 p-1">
        Tunnista {question.choises[question.rightAnswer]}
      </div>
      <div className="flex flex-col flex-wrap items-start justify-start h-screen w-screen">
        {question.choises.map((a, i) => (
          <div
            className={`p-2 flex-shrink-1 self-center ${birdCardWidth}`}
            style={{ maxWidth: birdCardMaxWidth, maxHeight: birdCardMaxHeight }}
            key={`qa${questionIndex}-${i}-${JSON.stringify(question)}`}
          >
            <img
              style={{ objectFit: 'cover' }}
              className="w-full h-full"
              onClick={() => answer(i)}
              src={url + getBird(a).image}
              alt="salaisuus, arvaa mikä lintu"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { ImageQuestion }

/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'

import { getBird, Question } from '../data/levels'
import useWindowDimensions from './useWindowDimensions'

interface AnswerGridProps {
  question: Question
  answer: (string) => void
  questionIndex: number
  header: ReactNode
}
export function AnswerGrid({
  question,
  answer,
  questionIndex,
  header,
}: AnswerGridProps): ReactElement {
  const [isPortrait, setIsPortrait] = useState<boolean | undefined>()
  const { height, width } = useWindowDimensions()
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL
  if (url === undefined) {
    console.log(
      'Error, missing environment variable: NEXT_PUBLIC_BIRDIMAGE_URL',
    )
  }

  useEffect(() => {
    function onWindowResize() {
      setIsPortrait(
        typeof window === 'undefined' || window.innerHeight > window.innerWidth,
      )
    }

    window?.addEventListener('resize', onWindowResize)
    onWindowResize()
  }, [])

  function getRowsCols() {
    // use nice ratio for landscape screen
    const choises = question.choises.length

    const gridRows = choises <= 3 ? choises : choises <= 6 ? 3 : 5
    const gridCols = choises <= 3 ? 1 : 2
    return isPortrait
      ? { gridRows, gridCols }
      : { gridCols: gridRows, gridRows: gridCols }
  }

  const { gridRows, gridCols } = getRowsCols()

  const w = isPortrait ? `${(width - 20 / gridCols).toFixed(0)}px` : '100%'
  const h = isPortrait ? '100%' : `${(height - 20 / gridRows).toFixed(0)}px`

  return (
    <div className="bg-gray-800 h-full">
      {header}
      <div
        className={`grid gap-2 grid-flow-col h-screen w-screen items-stretch`}
        style={{ gridTemplateRows: `repeat(${gridRows}, minmax(0,1fr))` }}
      >
        {question.choises.map((a, i) => (
          <div
            className={`self-center w-full`}
            key={`qa${questionIndex}-${i}-${JSON.stringify(question)}`}
          >
            <img
              onClick={() => {
                answer(i)
              }}
              src={url + getBird(a).image}
              alt="salaisuus, arvaa mikä lintu"
              className={`object-contain mx-auto`}
              style={{ width: w, height: h }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

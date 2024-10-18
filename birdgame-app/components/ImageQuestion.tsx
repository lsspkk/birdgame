/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { Question } from '../data/levels'
import { AnswerGrid } from './AnswerGrid'
import { CloseIcon } from './Icons'
import { useSpeech } from './useSpeech'

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
  const router = useRouter()
  const birdName = question.choises[question.rightAnswer]

  useSpeech(birdName)

  return (
    <AnswerGrid
      answer={answer}
      question={question}
      questionIndex={questionIndex}
      header={
        <>
          <div className="text-base md:text-xl absolute bg-white bg-opacity-50 p-1">
            <div>Tunnista {birdName}</div>
          </div>
          <CloseIcon
            className="h-8 w-8 absolute right-0"
            onClick={() => router.push('/')}
          />
        </>
      }
    />
  )
}

export { ImageQuestion }

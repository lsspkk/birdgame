/* eslint-disable @next/next/no-img-element */
import React, { ReactElement } from 'react'

import { Question } from '../data/levels'
import { AnswerGrid } from './AnswerGrid'
//import Image from 'next/image'

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
  return (
    <AnswerGrid
      answer={answer}
      question={question}
      questionIndex={questionIndex}
      header={
        <div className="text-base md:text-xl absolute bg-white bg-opacity-50 p-1">
          Tunnista {question.choises[question.rightAnswer]}
        </div>
      }
    />
  )
}

export { ImageQuestion }

import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { JsxElement } from 'typescript'
import Question from '../../data/level'
import { Bird, getBird } from '../data/levels'

interface ImageQuestionProps {
  question: Question
  answer: (string) => void
  questionIndex: number
}
function ImageQuestion({
  question,
  answer,
  questionIndex,
}: ImageQuestionProps): JsxElement {
  const url = process.env.NEXT_PUBLIC_BIRDIMAGE_URL
  if (url === undefined) {
    console.log(
      'Error, missing environment variable: NEXT_PUBLIC_BIRDIMAGE_URL',
    )
  }

  return (
    <div className="max-h-screen bg-gray-800">
      <div className="text-xl absolute bg-white bg-opacity-50 p-1">
        Tunnista {question.choises[question.rightAnswer]}
      </div>
      <div className="flex flex-col flex-wrap max-h-screen h-screen w-screen items-start justify-start">
        {question.choises.map((a, i) => (
          <img
            className="p-2 w-auto h-1/3 flex-shrink-0 self-center"
            key={`qa${questionIndex}-${i}-${JSON.stringify(question)}`}
            onClick={() => answer(i)}
            src={url + getBird(a).image}
          />
        ))}
      </div>
    </div>
  )
}

export { ImageQuestion }

import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useState } from 'react'
import { BirdIcon } from '../../components/Icons'
import { Layout } from '../../components/Layout'
import { ImageQuestion } from '../../components/ImageQuestion'
import { newLevel } from '../../data/levels'
import { settings, Setting } from '../../data/settings'
import { JsxElement } from 'typescript'

export default function Home(): JsxElement {
  const router = useRouter()
  const { levelNumber } = router.query
  const level: number = parseInt(levelNumber)
  const questions: Question[] = newLevel(level, true)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [points, setPoints] = useState(0)
  const [animation, setAnimation] = useState('')
  const [birdName, setBirdName] = useState('')

  const setting: Setting = settings.levels.filter(
    (setting) => setting.level === level,
  )[0]
  function answer(answerIndex: number) {
    if (questions[questionIndex].rightAnswer === answerIndex) {
      setPoints(points + 1)
      setAnimation('right')
    } else {
      setAnimation('wrong')
    }
    setBirdName(questions[questionIndex].choises[answerIndex])
    setTimeout(() => setAnimation(''), 3000)
    setQuestionIndex(questionIndex + 1)
  }
  return (
    <Layout>
      {animation !== '' && (
        <>
          <img
            className="absolute top-0 left-0 w-full max-h-full"
            src={`/${animation}-answer.gif`}
          />
          {animation === 'right' && (
            <div className="absolute top-0 left-0 w-full text-4xl text-center m-4 text-green-800">
              Oikein: {birdName}
            </div>
          )}
          {animation === 'wrong' && (
            <div className="absolute top-0 left-0 w-full text-4xl text-center m-4 text-red-900">
              Väärin: {birdName}
            </div>
          )}
        </>
      )}
      {animation === '' && questionIndex < questions.length && (
        <ImageQuestion
          question={questions[questionIndex]}
          answer={answer}
          questionIndex={questionIndex}
        />
      )}
      {animation === '' && questionIndex >= questions.length && (
        <div>
          <h1>Hyvin tehty!</h1>
          <div>
            Oikeita vastauksia: {points} / {setting?.questions}
          </div>
        </div>
      )}
    </Layout>
  )
}

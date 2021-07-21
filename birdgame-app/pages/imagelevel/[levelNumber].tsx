import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { Layout } from '../../components/Layout'
import { ImageQuestion } from '../../components/ImageQuestion'
import { newLevel, Question } from '../../data/levels'
import { settings, Setting } from '../../data/settings'

export default function Home(): React.ReactElement {
  const router = useRouter()
  const { levelNumber } = router.query
  const level: number = levelNumber === undefined ? 1 : parseInt(levelNumber[0])
  const questions: Question[] = newLevel(level, true, undefined)
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


  const animationSrc = `${process.env.NEXT_PUBLIC_BASE_PATH}${animation}-answer.gif`

  return (
    <Layout>
      {animation !== '' && (
        <>
          <img
            className="absolute top-0 left-0 w-full max-h-full"
            src={animationSrc}
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
        <div className="mt-8 text-4xl text-blue-400 text-center">
          <h1 className="p-2">Hyvin tehty!</h1>
          <div className="p-2">
            Oikeita vastauksia: {points} / {setting?.questions}
          </div>

          <Link href="/"><div className="mt-8 text-2xl bg-blue-300 p-2 rounded w-1/4 text-white m-auto self-center">Takaisin</div></Link>
        </div>
      )}
    </Layout>
  )
}

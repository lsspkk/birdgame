import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useState } from 'react'
import { Layout } from '../../components/Layout'
import { ImageQuestion } from '../../components/ImageQuestion'
import { newLevel, Question } from '../../data/levels'
import { settings, Setting } from '../../data/settings'
import { GameContext } from '../../components/ContextWrapper'
import {
  IBirdKnowledge,
  emptyBirdKnowledge,
  emptyScore,
  ScoreInterface,
} from '../../models/score'
import { GameKnowledgeView } from '../../components/GameKnowledgeView'
import { GameResultsView } from '../../components/GameResultsView'
import { basePath } from '../../next.config'

export default function ImageLevel(): ReactElement {
  const router = useRouter()
  const { levelNumber } = router.query
  const level: number = levelNumber === undefined ? 1 : parseInt(levelNumber[0])
  const questions: Question[] = newLevel(level, true, undefined)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [gameScore, setGameScore] = useState(0)
  const [animation, setAnimation] = useState('')
  const [birdName, setBirdName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [score, setScore] = useState<ScoreInterface>(emptyScore)
  const { setBirdKnowledge, birdKnowledge, user } = useContext(GameContext)

  const setting: Setting = settings.levels.filter((s) => s.level === level)[0]
  function answer(answerIndex: number) {
    const question = questions[questionIndex]
    const rightBirdName = question.choises[question.rightAnswer]
    const knowledge: IBirdKnowledge = {
      ...emptyBirdKnowledge,
      bird: rightBirdName,
    }
    if (question.rightAnswer === answerIndex) {
      setGameScore(gameScore + 1)
      setAnimation('right')
      knowledge.rightImageAnswers = 1
    } else {
      setAnimation('wrong')
      knowledge.wrongImageAnswers = 1
    }
    const newKnowledge = [...birdKnowledge, knowledge]
    setBirdKnowledge(newKnowledge)

    setBirdName(question.choises[answerIndex])
    setTimeout(() => setAnimation(''), 3000)
    setQuestionIndex(questionIndex + 1)

    if (questionIndex >= questions.length && user._id !== undefined) {
      saveGameResult(newKnowledge)
    }
  }

  async function saveGameResult(newKnowledge: IBirdKnowledge[]) {
    setIsSaving(true)
    const res = await fetch(`${basePath}/api/scores`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user._id,
        knowledge: newKnowledge,
        gameResult: { level, isImage: true, scores: [gameScore] },
      }),
    })
    if (res.ok) {
      const updatedScore = await res.json()
      setScore(updatedScore)
    } else {
      setScore(emptyScore)
    }
    setIsSaving(false)
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
            Oikeita vastauksia: {gameScore} / {setting?.questions}
          </div>
          {user._id !== undefined && isSaving && (
            <p>Tallennetaan tuloksia...</p>
          )}
          {user._id !== undefined && !isSaving && (
            <>
              <GameResultsView results={score.results} />
              <GameKnowledgeView knowledge={score.knowledge} />
            </>
          )}
          {!isSaving && (
            <Link href="/">
              <div className="mt-8 text-2xl bg-blue-300 p-2 rounded w-1/4 text-white m-auto self-center">
                Takaisin
              </div>
            </Link>
          )}
        </div>
      )}
    </Layout>
  )
}

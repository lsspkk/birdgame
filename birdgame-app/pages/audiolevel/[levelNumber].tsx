/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useState } from 'react'
import { Layout } from '../../components/Layout'
import { AudioQuestion } from '../../components/AudioQuestion'
import { newLevel, Question } from '../../data/levels'
import { settings, Setting } from '../../data/settings'
import { GameContext } from '../../components/state'
import {
  IBirdKnowledge,
  emptyBirdKnowledge,
  emptyScore,
  ScoreInterface,
} from '../../models/score'
// import { basePath } from '../../next.config'
import { isStarScore, SpinningStar } from '../../components/StarCircle'
//import Image from 'next/image'

export default function AudioLevel(): ReactElement {
  const router = useRouter()
  const { levelNumber } = router.query
  const level: number = levelNumber === undefined ? 1 : parseInt(levelNumber[0])
  const questions: Question[] = newLevel(level, true, undefined)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [gameScore, setGameScore] = useState(0)
  const [animation, setAnimation] = useState('')
  const [birdName, setBirdName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [, setScore] = useState<ScoreInterface>(emptyScore)
  const { setBirdKnowledge, birdKnowledge, user } = useContext(GameContext)

  const setting: Setting = settings.levels.filter((s) => s.level === level)[0]

  function answer(answerIndex: number) {
    const question = questions[questionIndex]
    const rightBirdName = question.choises[question.rightAnswer]
    const oldIndex = birdKnowledge.findIndex((b) => b.bird === rightBirdName)
    const baseKnowledge =
      oldIndex === -1 ? emptyBirdKnowledge : birdKnowledge[oldIndex]
    const knowledge: IBirdKnowledge = {
      ...baseKnowledge,
      bird: rightBirdName,
    }
    console.log('oikea:', question.rightAnswer, 'oma vastaus', answerIndex)
    if (question.rightAnswer === answerIndex) {
      setGameScore(gameScore + 1)
      setAnimation('right')

      knowledge.rightAudioAnswers += 1
    } else {
      setAnimation('wrong')

      knowledge.wrongAudioAnswers += 1
    }
    let newKnowledge: IBirdKnowledge[] = []
    if (oldIndex !== -1) {
      newKnowledge = birdKnowledge.map((k, index) =>
        index === oldIndex ? knowledge : k,
      )
    } else {
      newKnowledge = [...birdKnowledge, knowledge]
    }

    setBirdKnowledge(newKnowledge)

    setBirdName(question.choises[answerIndex])
    setTimeout(() => setAnimation(''), 3000)
    setQuestionIndex(questionIndex + 1)

    if (questionIndex + 1 >= questions.length && user._id !== undefined) {
      saveGameResult(newKnowledge)
    }
  }

  async function saveGameResult(newKnowledge: IBirdKnowledge[]) {
    console.log(newKnowledge)
    // setIsSaving(true)
    // const res = await fetch(`${basePath}/api/scores`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     userId: user._id,
    //     knowledge: newKnowledge,
    //     gameResult: { level: `${level}`, isImage: false, scores: [gameScore] },
    //   }),
    // })
    // if (res.ok) {
    //   const updatedScore = await res.json()
    //   updatedScore.knowledge.sort((a, b) => {
    //     if (a.rightAudioAnswers < b.rightAudioAnswers) return 1
    //     if (b.rightAudioAnswers < a.rightAudioAnswers) return -1
    //     return 0
    //   })
    //setScore(updatedScore)
    // } else {
    //   setScore(emptyScore)
    // }
    setScore(emptyScore)
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
            alt={animation}
            width="100%"
            height="auto"
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
        <AudioQuestion
          question={questions[questionIndex]}
          answer={answer}
          questionIndex={questionIndex}
        />
      )}
      {animation === '' && questionIndex >= questions.length && (
        <div className="mt-8 flex flex-col justify-center content-center items-center">
          <div className="flex justify-center text-center">
            <div>
              <SpinningStar
                shadow={!isStarScore(gameScore, setting?.questions)}
              />
            </div>
            <div>
              <h1 className="text-2xl text-blue-400">Hyvin tehty!</h1>
              <div className="p-2">
                Oikeita vastauksia: {gameScore} / {setting?.questions}
              </div>
              {user._id !== undefined && isSaving && (
                <p>Tallennetaan tuloksia...</p>
              )}
              {!isSaving && (
                <Link href="/" passHref>
                  <div className="mt-2 mb-8 text-xl w-30 bg-blue-300 py-2 px-4 rounded text-white self-center border shadow">
                    Takaisin
                  </div>
                </Link>
              )}
            </div>
          </div>
          {user._id !== undefined && !isSaving && (
            <div className="flex-column items-center w-full justify-center justify-items-center">
              {/* <GameResultsView results={score.results} /> */}
              {/* <GameKnowledgeView knowledge={score.knowledge} /> */}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

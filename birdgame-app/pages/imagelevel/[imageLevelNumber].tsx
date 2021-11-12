/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useContext, useState } from 'react'
import { Layout } from '../../components/Layout'
import { ImageQuestion } from '../../components/ImageQuestion'
import { newLevel, Question } from '../../data/levels'
import { settings, Setting } from '../../data/settings'
import { GameContext } from '../../components/state'
import {
  IBirdKnowledge,
  emptyBirdKnowledge,
  emptyScore,
  ScoreInterface,
} from '../../models/score'
import { GameResultsView } from '../../components/GameResultsView'
import { basePath } from '../../next.config'
import { isStarScore, SpinningStar } from '../../components/StarCircle'
//import Image from 'next/image'

export default function ImageLevel(): ReactElement {
  const router = useRouter()
  const { imageLevelNumber } = router.query
  const level: number =
    imageLevelNumber === undefined ? 1 : parseInt(imageLevelNumber[0])
  const questions: Question[] = newLevel(level, true, undefined)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [gameScore, setGameScore] = useState(0)
  const [animation, setAnimation] = useState('')
  const [birdName, setBirdName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [score, setScore] = useState<ScoreInterface>(emptyScore)
  const {
    settings: contextSettings,
    setBirdKnowledge,
    birdKnowledge,
    user,
    setScore: setContextScore,
  } = useContext(GameContext)

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

    if (question.rightAnswer === answerIndex) {
      setGameScore(gameScore + 1)
      if (contextSettings.sound) {
        play('cheer')
      }
      setAnimation('right')

      knowledge.answers.forEach((a) => {
        if (a.answerType === 'image') a.right += 1
      })
    } else {
      if (contextSettings.sound) {
        play('cry')
      }
      setAnimation('wrong')

      knowledge.answers.forEach((a) => {
        if (a.answerType === 'image') a.wrong += 1
      })
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
    setTimeout(() => setAnimation(''), contextSettings.delay)
    setQuestionIndex(questionIndex + 1)

    if (questionIndex + 1 >= questions.length && user._id !== undefined) {
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
        gameResult: {
          level: `${level}`,
          resultType: 'image',
          scores: [gameScore],
        },
      }),
    })
    if (res.ok) {
      const updatedScore = await res.json()
      updatedScore.knowledge.sort((a, b) => {
        const rightA = a.answers.map((an) => an.right).reduce((p, c) => p + c)
        const rightB = b.answers.map((an) => an.right).reduce((p, c) => p + c)

        if (rightA < rightB) return 1
        if (rightB < rightA) return -1
        return 0
      })
      setScore(updatedScore)
      setContextScore(updatedScore)
    } else {
      setScore(emptyScore)
    }
    setIsSaving(false)
  }

  function play(soundName: string) {
    const audioElement = document.querySelector(
      `.${soundName}`,
    ) as HTMLAudioElement
    audioElement.play()
  }

  const animationSrc = `${process.env.NEXT_PUBLIC_BASE_PATH}${animation}-answer.gif`

  return (
    <Layout>
      <audio
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}cheer.mp3`}
        className={`hidden cheer`}
      />
      <audio
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}cry.mp3`}
        className={`hidden cry`}
      />

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
        <ImageQuestion
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
              <GameResultsView
                results={score.results.filter((s) => s.resultType === 'image')}
              />
              {/* <GameKnowledgeView knowledge={score.knowledge} /> */}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

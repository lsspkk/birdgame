import React, { ReactElement, useState, useContext, useEffect } from 'react'
import { Button } from '../../components/basic/Button'

import { Layout } from '../../components/Layout'
import { newLevel, Question } from '../../data/levels'
import {
  emptyScore,
  IBirdKnowledge,
  ScoreInterface,
  emptyBirdKnowledge,
} from '../../models/ScoreInterface'
import { GameContext } from '../../components/state'
import { basePath } from '../../next.config'

// for generating bird knowledge and game results
// saving, and showing some result/knowledge views
export default function Random(): ReactElement {
  const [questionIndex, setQuestionIndex] = useState(0)

  const level = 1
  const [gameScore, setGameScore] = useState(0)
  const [, setIsSaving] = useState(false)
  const [score, setScore] = useState<ScoreInterface>(emptyScore)
  const { setBirdKnowledge, birdKnowledge, user } = useContext(GameContext)
  const [questions, setQuestions] = useState(newLevel(level, true, undefined))

  useEffect(() => setBirdKnowledge([]), [setBirdKnowledge])

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
      knowledge.answers.forEach((a) => {
        if (a.answerType === 'image') a.right += 1
      })
    } else {
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

    const newIndex = questionIndex + 1
    setQuestionIndex(newIndex)
    if (newIndex >= questions.length && user._id !== undefined) {
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
    setQuestions(newLevel(level, true, undefined))
    setQuestionIndex(0)
    setBirdKnowledge([])
  }

  return (
    <Layout>
      {questions.map((q: Question, i: number) => (
        <div
          className="inline-block float-left"
          key={`lone${i}${q.rightAnswer}`}
        >
          {q.choises.join(' ... ')}
          {q.rightAnswer}
        </div>
      ))}
      <Button onClick={() => answer(0)}>Vastaile</Button>
      <hr />
      birdKnowledge
      {JSON.stringify(birdKnowledge)}
      <hr />
      score
      {JSON.stringify(score)}
    </Layout>
  )
}

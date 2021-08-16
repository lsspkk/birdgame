import React, { ReactElement, useState, useContext, useEffect } from 'react'
import { Button } from '../../components/basic/Button'

import { Layout } from '../../components/Layout'
import { newLevel, Question } from '../../data/levels'
import { emptyScore } from '../../models/score'
import { GameContext } from '../../components/ContextWrapper'

import { emptyBirdKnowledge } from '../../models/score'
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
  const [questions] = useState(newLevel(level, true, undefined))

  useEffect(() => setBirdKnowledge([]), [])

  function answer(answerIndex: number) {
    const question = questions[questionIndex]
    const rightBirdName = question.choises[question.rightAnswer]
    const knowledge: IBirdKnowledge = {
      ...emptyBirdKnowledge,
      bird: rightBirdName,
    }
    if (question.rightAnswer === answerIndex) {
      setGameScore(gameScore + 1)
      knowledge.rightImageAnswers = 1
    } else {
      knowledge.wrongImageAnswers = 1
    }
    const newKnowledge = [...birdKnowledge, knowledge]
    setBirdKnowledge(newKnowledge)

    const newIndex = questionIndex + 1
    setQuestionIndex(newIndex)
    console.log(newIndex, questions.length, user._id)
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
  }

  return (
    <Layout>
      {questions.map((q: Question, i: number) => (
        <div
          className="inline-block float-left"
          key={`lone${i}${q.rightAnswer}`}
        >
          {q.choises}
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

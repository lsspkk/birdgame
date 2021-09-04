import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { IBirdKnowledge, ScoreInterface } from '../models/score'
import { emptyUser, UserInterface } from '../models/user'
import { Props } from './Layout'
import { basePath } from '../next.config'

export interface GameContextInterface {
  user: UserInterface
  setUser: (UserInterface) => void
  birdKnowledge: IBirdKnowledge[]
  setBirdKnowledge: (a: IBirdKnowledge[], callback?: () => void) => void
  score: ScoreInterface | undefined
  setScore: (a: ScoreInterface, callback?: () => void) => void
}
export const GameContext = createContext<GameContextInterface>({
  user: emptyUser,
  setUser: () => null,
  birdKnowledge: [],
  setBirdKnowledge: () => null,
  score: undefined,
  setScore: () => null,
})

export function ContextWrapper({ children }: Props): ReactElement {
  const [user, setUser] = useState<UserInterface>(emptyUser)
  const [birdKnowledge, setBirdKnowledge] =
    useState<IBirdKnowledge[]>(undefined)
  const [score, setScore] = useState<ScoreInterface>(undefined)
  const state = {
    user,
    setUser,
    birdKnowledge,
    setBirdKnowledge,
    score: score,
    setScore: setScore,
  }

  async function loadScore(userId: string) {
    const res = await fetch(`${basePath}/api/scores/user/${userId}`)
    if (res.ok) {
      const loadedScore = (await res.json()) as ScoreInterface
      loadedScore.knowledge.sort((a, b) => {
        if (a.rightImageAnswers < b.rightImageAnswers) return 1
        if (b.rightImageAnswers < a.rightImageAnswers) return -1
        return 0
      })
      setScore(loadedScore)
    }
  }
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString !== null) {
      const loadedUser = JSON.parse(userString) as UserInterface
      setUser(loadedUser)
      if (loadedUser._id !== '') {
        loadScore(loadedUser._id)
      }
    }
  }, [])
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

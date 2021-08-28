import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { IBirdKnowledge, IGameResult, ScoreInterface } from '../models/score'
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

  useEffect(async () => {
    const userString = localStorage.getItem('user')
    if (userString !== null) {
      const loadedUser = JSON.parse(userString) as UserInterface
      setUser(loadedUser)
      if (loadedUser._id !== '') {
        const res = await fetch(`${basePath}/api/scores/user/${loadedUser._id}`)
        if (res.ok) {
          const loadedScore = (await res.json()) as ScoreInterface
          setScore(loadedScore)
        }
      }
    }
  }, [])
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

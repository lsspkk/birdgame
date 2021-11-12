import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { IBirdKnowledge, ScoreInterface } from '../models/score'
import { emptyUser, UserInterface } from '../models/user'
import { Props } from './Layout'
import { basePath } from '../next.config'

export interface Settings {
  sound: boolean
  delay: number
}

export interface GameContextInterface {
  user: UserInterface
  setUser: (UserInterface) => void
  birdKnowledge: IBirdKnowledge[]
  setBirdKnowledge: (a: IBirdKnowledge[], callback?: () => void) => void
  score: ScoreInterface | undefined
  setScore: (a: ScoreInterface, callback?: () => void) => void
  settings?: Settings
  setSettings: (a: Settings, callback?: () => void) => void
}

export const GameContext = createContext<GameContextInterface>({
  user: emptyUser,
  setUser: () => null,
  birdKnowledge: [],
  setBirdKnowledge: () => null,
  score: undefined,
  setScore: () => null,
  settings: undefined,
  setSettings: () => null,
})

export function ContextWrapper({ children }: Props): ReactElement {
  const [user, setUser] = useState<UserInterface>(emptyUser)
  const [birdKnowledge, setBirdKnowledge] =
    useState<IBirdKnowledge[]>(undefined)
  const [score, setScore] = useState<ScoreInterface>(undefined)
  const [settings, setSettings] = useState<Settings>({
    sound: true,
    delay: 3000,
  })
  const state = {
    user,
    setUser,
    birdKnowledge,
    setBirdKnowledge,
    score: score,
    setScore: setScore,
    settings: settings,
    setSettings: setSettings,
  }

  async function loadScore(userId: string) {
    const res = await fetch(`${basePath}/api/scores/user/${userId}`)
    if (res.ok) {
      const loadedScore = (await res.json()) as ScoreInterface
      loadedScore.knowledge.sort((a, b) => {
        const rightA = a.answers.map((an) => an.right).reduce((p, c) => p + c)
        const rightB = b.answers.map((an) => an.right).reduce((p, c) => p + c)

        if (rightA < rightB) return 1
        if (rightB < rightA) return -1
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
    const settingsString = localStorage.getItem('settings')
    if (settingsString) {
      const loadedSettings = JSON.parse(settingsString) as Settings
      setSettings(loadedSettings)
    }
  }, [])
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

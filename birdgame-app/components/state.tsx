import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { IBirdKnowledge, ScoreInterface } from '../models/IGameResult'
import { emptyUser, UserInterface } from '../models/UserInterface'
import { Props } from './Layout'
import { basePath } from '../next.config'

export type SettingColor = 'red' | 'gray' | 'blue'
export interface Settings {
  sound: boolean
  delay: number
  color: SettingColor
}

export function getBgColor(c: 'gray' | 'red' | 'blue') {
  if (c === 'red') return 'rgb(250 0 0 / 0.4)'
  if (c === 'blue') return 'rgb(0 0 250 / 0.4)'
  return 'rgb(100 100 100 / 0.4)'
}
export function getTextColor(c: 'gray' | 'red' | 'blue') {
  if (c === 'red') return 'text-red-400'
  if (c === 'blue') return 'text-blue-400'
  return 'text-gray-400'
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
    color: 'gray',
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
      const loadedSettings = JSON.parse(settingsString)
      if (!Object.keys(loadedSettings).includes('color')) {
        loadedSettings['color'] = 'gray'
      }

      setSettings(loadedSettings as Settings)
    }
  }, [])
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

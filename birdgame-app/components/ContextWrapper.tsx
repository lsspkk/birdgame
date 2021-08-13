import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { IBirdKnowledge } from '../models/score'
import { emptyUser, UserInterface } from '../models/user'
import { Props } from './Layout'

export interface GameContextInterface {
  user: UserInterface
  setUser: (UserInterface) => void
  birdKnowledge: IBirdKnowledge[]
  setBirdKnowledge: (a: IBirdKnowledge[]) => void
}
export const GameContext = createContext<GameContextInterface>({
  user: emptyUser,
  setUser: () => null,
  birdKnowledge: [],
  setBirdKnowledge: () => null,
})

export function ContextWrapper({ children }: Props): ReactElement {
  const [user, setUser] = useState<UserInterface>(emptyUser)
  const [birdKnowledge, setBirdKnowledge] =
    useState<IBirdKnowledge[]>(undefined)
  const state = { user, setUser, birdKnowledge, setBirdKnowledge }

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString !== undefined) {
      setUser(JSON.parse(userString))
    }
  }, [])
  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

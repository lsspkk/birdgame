import { useRouter } from 'next/dist/client/router'
import React, {
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ScoreInterface } from '../../models/IGameResult'
import { basePath } from '../../next.config'
import { Button } from '../basic/Button'
import { GameContext, GameContextInterface } from '../state'
import { emptyScore } from '../../models/IGameResult'
import { UserInterface } from '../../models/UserInterface'

export interface SelectUserDialogProps {
  user: UserInterface
  close: () => void
}
export function SelectUserDialog({
  user,
  close,
}: SelectUserDialogProps): ReactElement {
  const [password, setPassword] = useState<string>('')
  const { setUser, setScore }: GameContextInterface = useContext(GameContext)
  const [isWrong, setIsWrong] = useState<boolean>(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>()

  function handleClickOutside(event: Event) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      cancel()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
  })
  async function confirmPassword() {
    if (password === '') {
      return
    }
    const res = await fetch(`${basePath}/api/teams/userLogin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user._id, teamId: user.teamId, password }),
    })
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      setScore(emptyScore)
      const res2 = await fetch(`${basePath}/api/scores/user/${user._id}`)
      if (res2.ok) {
        const loadedScore = (await res2.json()) as ScoreInterface
        setScore(loadedScore)
      }
      router.push('/')
    } else {
      setIsWrong(true)
      setTimeout(() => setIsWrong(false), 3000)
    }
  }
  function cancel() {
    setPassword('')
    close()
  }
  return (
    <div
      className="absolute w-11/12 inset-x-4 md:w-auto bg-white p-6 border rounded shadow-xl"
      ref={ref}
    >
      <div className="my-2 text-sm">Valitse pelaajaksi {user.name}</div>
      <div className="my-2">Salasana</div>
      <input
        className={`my-2 p-2 border ${
          isWrong && 'border-4 border-red-300 shadow'
        }`}
        type="password"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value)
          setIsWrong(false)
        }}
        onKeyPress={(event: KeyboardEvent) =>
          event.key === 'Enter' && confirmPassword()
        }
      ></input>
      {isWrong && <div className="text-red-300">Väärä salasana</div>}
      <div className="flex my-2 w-full justify-between">
        <Button onClick={cancel}>Peruuta</Button>
        <Button onClick={() => confirmPassword()}>Ok</Button>
      </div>
    </div>
  )
}

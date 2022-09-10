import React, {
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TeamInterface } from '../../models/TeamInterface'
import { basePath } from '../../next.config'
import { Button } from '../basic/Button'

export interface EditTeamDialogProps {
  team: TeamInterface
  close: () => void
  setViewMode: (GroupViewMode) => void
}
export function EditTeamDialog({
  team,
  close,
  setViewMode,
}: EditTeamDialogProps): ReactElement {
  const [password, setPassword] = useState<string>('')
  const [isWrong, setIsWrong] = useState<boolean>(false)
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
    const res = await fetch(`${basePath}/api/teams/teamLogin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: team._id, password }),
    })
    if (res.ok) {
      setPassword('')
      const teamToEdit = (await res.json()) as TeamInterface
      //console.log(teamToEdit)
      setViewMode({ view: 'edit', teamToEdit })
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
      <div className="my-2 text-sm">Muokkaa joukkuetta {team.name}</div>
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

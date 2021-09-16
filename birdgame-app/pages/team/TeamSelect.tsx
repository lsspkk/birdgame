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
import { UsersData, useUsers } from '../../models/swrApi'
import { isAnonymous, TeamInterface } from '../../models/team'
import { UserInterface } from '../../models/user'
import { ScoreInterface } from '../../models/score'
import { basePath } from '../../next.config'
import { Button } from '../../components/basic/Button'
import { Title } from '../../components/basic/Title'
import { GameContext, GameContextInterface } from '../../components/state'
import { DownArrow, UpArrow } from '../../components/Icons'
import { Player } from '../../components/Player'
import { emptyScore } from '../../models/score'
import { CreateTeamPlayer } from './CreateTeamPlayer'

export interface TeamSelectProps {
  team: TeamInterface
}
function TeamSelect({ team }: TeamSelectProps): ReactElement {
  const { user } = useContext(GameContext)

  const [show, setShow] = useState<boolean>(user.teamId === team._id)
  return (
    <div className="border p-4">
      <div
        className="flex w-full justify-between"
        onClick={() => setShow(!show)}
      >
        <div className="text-red-900 font-bold py-2 rounded  text-2xl">
          {team.name}
        </div>
        {!show && (
          <Button onClick={() => setShow(!show)}>
            <DownArrow />
          </Button>
        )}
        {show && (
          <Button onClick={() => setShow(!show)}>
            <UpArrow />
          </Button>
        )}
      </div>
      {show && (
        <div>
          <TeamPlayerList team={team} />
        </div>
      )}
    </div>
  )
}

function TeamPlayerList({ team }: TeamSelectProps): ReactElement {
  const [show, setShow] = useState<boolean>(false)
  const [passwordDialogUser, setPasswordDialogUser] = useState<string>('')
  const data: UsersData = useUsers(team._id)
  const { user }: GameContextInterface = useContext(GameContext)

  if (data.isLoading) return <div />

  if (data.isError) return <div>Virhe ladattaessa pelaajia</div>

  // TODO ask for password when changin player

  return (
    <div>
      <Title>Pelaajat</Title>

      <div className="flex items-center">
        {!show && (
          <>
            {data.users.length === 0 && (
              <div className="pr-4">
                Ei pelaajia {!isAnonymous(team._id) && <>joukkueessa</>}
              </div>
            )}

            {data.users.map((u: UserInterface) => (
              <div
                key={`selectUser${u._id}`}
                onClick={() => {
                  if (user._id === u._id) {
                    setPasswordDialogUser('')
                  } else if (passwordDialogUser === '') {
                    setPasswordDialogUser(u._id)
                  }
                }}
              >
                <Player user={u} />
                {u._id === passwordDialogUser && (
                  <UserPasswordDialog
                    user={u}
                    close={() => setPasswordDialogUser('')}
                  />
                )}
              </div>
            ))}
            {
              <Button className="ml-8" onClick={() => setShow(!show)}>
                Lisää
              </Button>
            }
          </>
        )}
        {show && <CreateTeamPlayer team={team} setShow={setShow} />}
      </div>
    </div>
  )
}
interface UserPasswordDialogProps {
  user: UserInterface
  close: () => void
}
function UserPasswordDialog({
  user,
  close,
}: UserPasswordDialogProps): ReactElement {
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

export { TeamSelect }

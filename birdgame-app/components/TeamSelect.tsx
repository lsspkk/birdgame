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
import { UsersData, useUsers } from '../models/swrApi'
import { TeamInterface } from '../models/team'
import { UserInterface } from '../models/user'
import { ScoreInterface } from '../models/score'
import { basePath } from '../next.config'
import { Button } from './basic/Button'
import { Message } from './basic/Message'
import { Title } from './basic/Title'
import { GameContext, GameContextInterface } from './state'
import { DownArrow, UpArrow } from './Icons'
import { Avatar, ChooseAvatar, Player } from './Player'
import { emptyScore } from '../models/score'

interface TeamSelectProps {
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
              <div className="pr-4">Ei pelaajia joukkueessa</div>
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
        {show && <AddTeamPlayer team={team} setShow={setShow} />}
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

interface AddTeamPlayerProps extends TeamSelectProps {
  setShow: (boolean) => void
}
interface AddTeamPlayerState {
  name: string
  password: string
  passwordConfirm: string
  avatar: string
  addUserPassword: string
}
const emptyAddState: AddTeamPlayerState = {
  name: '',
  password: '',
  avatar: 'girl.svg',
  passwordConfirm: '',
  addUserPassword: '',
}

function AddTeamPlayer({ team, setShow }: AddTeamPlayerProps): ReactElement {
  const [addState, setAddState] = useState<AddTeamPlayerState>(emptyAddState)
  const [message, setMessage] = useState<string>('')
  const router = useRouter()
  const { setUser }: GameContextInterface = useContext(GameContext)

  function cancel(): void {
    setAddState(emptyAddState)
    setMessage('')
    setShow(false)
  }
  async function save(): Promise<void> {
    if (addState.password !== addState.passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (addState.password.trim().length < 4) {
      setMessage('Salasanan pituus ei riitä')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const res = await fetch(`${basePath}/api/teams/${team._id}/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addState),
    })
    if (res.ok) {
      const savedPlayer = await res.json()

      setUser(savedPlayer)
      localStorage.setItem('user', JSON.stringify(savedPlayer))
      router.push('/')
    } else if (res.status === 401) {
      setMessage('Väärä lisäyskoodi')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setAddState({ ...addState, [event.target.name]: event.target.value })
  }

  return (
    <div>
      <Title>Lisää pelaaja joukkueeseen</Title>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Nimi:</div>
        <input
          className="p-2 border"
          type="text"
          value={addState.name}
          name="name"
          onChange={handleChange}
        ></input>
      </div>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Salasana:</div>
        <input
          className="p-2 border"
          type="text"
          value={addState.password}
          name="password"
          onChange={handleChange}
        ></input>
      </div>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">
          Salasana
          <br />
          uudestaan:
        </div>
        <input
          className="p-2 border"
          type="text"
          value={addState.passwordConfirm}
          name="passwordConfirm"
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Kuva:</div>
        <div className="flex-shrink-0">
          {' '}
          <Avatar avatar={addState.avatar} />
        </div>
        <div>
          {' '}
          <ChooseAvatar
            chosen={addState.avatar}
            setAvatar={(avatar) => setAddState({ ...addState, avatar })}
          />
        </div>
      </div>

      <div className="flex items-center pt-20">
        <div className="w-20 mr-4">Lisäyskoodi</div>
        <input
          className="p-2 border"
          type="text"
          value={addState.addUserPassword}
          name="addUserPassword"
          onChange={handleChange}
        ></input>
      </div>
      <p className="pt-4">
        Voit luoda pelaajan tähän joukkueeseen, jos tiedät joukkueen
        lisäyskoodin eli linnun nimen.
      </p>

      {message !== '' && <Message>{message}</Message>}
      <div className="flex w-full md:w-1/2 justify-around pt-20">
        <Button onClick={() => cancel()}>Peruuta</Button>
        <Button onClick={() => save()}>Lisää</Button>
      </div>
    </div>
  )
}
export { TeamSelect }

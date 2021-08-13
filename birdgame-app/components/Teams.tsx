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
import { basePath } from '../next.config'
import { Button } from './basic/Button'
import { Message } from './basic/Message'
import { Title } from './basic/Title'
import { GameContext, GameContextInterface } from './ContextWrapper'
import { DownArrow, UpArrow } from './Icons'
import { Avatar, ChooseAvatar, Player } from './Player'

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
  const { user, setUser }: GameContextInterface = useContext(GameContext)
  const router = useRouter()

  if (data.isLoading) return <div />

  if (data.isError) return <div>Virhe ladattaessa pelaajia</div>

  // TODO ask for password when changin player
  const canChange: boolean = user.teamId === team._id

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
                  if (!canChange) {
                    if (passwordDialogUser === '') {
                      setPasswordDialogUser(u._id)
                    }
                    return
                  }
                  localStorage.setItem('user', JSON.stringify(u))
                  setUser(u)
                  router.push('/')
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
  const { setUser }: GameContextInterface = useContext(GameContext)
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
    <div className="absolute bg-white p-6 border rounded shadow-xl" ref={ref}>
      <div className="my-2">Salasana</div>
      <input
        className={`my-2 p-2 border ${
          isWrong && 'border-4 border-red-600 shadow'
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
function AddTeamPlayer({ team, setShow }: AddTeamPlayerProps): ReactElement {
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('girl.svg')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [addUserPassword, setAddUserPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const router = useRouter()
  const { setUser }: GameContextInterface = useContext(GameContext)

  function cancel(): void {
    setName('')
    setPassword('')
    setMessage('')
    setAvatar('girl.svg')
    setAddUserPassword('')
    setPasswordConfirm('')
    setShow(false)
  }
  async function save(): Promise<void> {
    if (password !== passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const newPlayer: UserInterface = { name, password, avatar, addUserPassword }
    const res = await fetch(`${basePath}/api/teams/${team._id}/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayer),
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
  return (
    <div>
      <Title>Lisää pelaaja joukkueeseen</Title>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Nimi:</div>
        <input
          className="p-2 border"
          type="text"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        ></input>
      </div>
      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Salasana:</div>
        <input
          className="p-2 border"
          type="text"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
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
          value={passwordConfirm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPasswordConfirm(event.target.value)
          }
        ></input>
      </div>

      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Kuva:</div>
        <div className="flex-shrink-0">
          {' '}
          <Avatar avatar={avatar} />
        </div>
        <div>
          {' '}
          <ChooseAvatar chosen={avatar} setAvatar={setAvatar} />
        </div>
      </div>

      <div className="flex items-center pt-20">
        <div className="w-20 mr-4">Lisäyskoodi</div>
        <input
          className="p-2 border"
          type="text"
          value={addUserPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAddUserPassword(event.target.value)
          }
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

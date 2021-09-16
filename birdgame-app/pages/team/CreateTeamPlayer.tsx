import { useRouter } from 'next/dist/client/router'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'
import { basePath } from '../../next.config'
import { Button } from '../../components/basic/Button'
import { Message } from '../../components/basic/Message'
import { Title } from '../../components/basic/Title'
import { GameContext, GameContextInterface } from '../../components/state'
import { Avatar, ChooseAvatar } from '../../components/Player'
import { TeamSelectProps } from './TeamSelect'
import { isAnonymous } from '../../models/team'
import { emptyBirdKnowledge, emptyScore } from '../../models/score'

interface CreateTeamPlayerProps extends TeamSelectProps {
  setShow: (boolean) => void
}
interface CreateTeamPlayerState {
  name: string
  password: string
  passwordConfirm: string
  avatar: string
  addUserPassword: string
}
const emptyAddState: CreateTeamPlayerState = {
  name: '',
  password: '',
  avatar: 'girl.svg',
  passwordConfirm: '',
  addUserPassword: '',
}

export function CreateTeamPlayer({
  team,
  setShow,
}: CreateTeamPlayerProps): ReactElement {
  const [addState, setAddState] = useState<CreateTeamPlayerState>(emptyAddState)
  const [message, setMessage] = useState<string>('')
  const router = useRouter()
  const { setUser, setBirdKnowledge, setScore }: GameContextInterface =
    useContext(GameContext)

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
    const url = !isAnonymous(team._id)
      ? `${basePath}/api/teams/${team._id}/add`
      : `${basePath}/api/users`
    const res = await fetch(url, {
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
      setScore(emptyScore)
      setBirdKnowledge([emptyBirdKnowledge])
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
      <Title>Lisää pelaaja {!isAnonymous(team._id) && <>joukkueeseen</>}</Title>
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

      {!isAnonymous(team._id) && (
        <>
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
        </>
      )}

      {message !== '' && <Message>{message}</Message>}
      <div className="flex w-full md:w-1/2 justify-around pt-20">
        <Button onClick={() => cancel()}>Peruuta</Button>
        <Button onClick={() => save()}>Lisää</Button>
      </div>
    </div>
  )
}

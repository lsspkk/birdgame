import { useRouter } from 'next/dist/client/router'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'
import { basePath } from '../../next.config'
import { Button } from '../basic/Button'
import { Message } from '../basic/Message'
import { Title } from '../basic/Title'
import { GameContext, GameContextInterface } from '../state'
import { Avatar, ChooseAvatar } from '../Player'

export interface AddTeamPlayerProps extends TeamCardProps {
  setShow: (boolean) => void
}

export interface AddTeamPlayerState {
  name: string
  password: string
  passwordConfirm: string
  avatar: string
  addUserPassword: string
}

export const emptyAddState: AddTeamPlayerState = {
  name: '',
  password: '',
  avatar: 'girl.svg',
  passwordConfirm: '',
  addUserPassword: '',
}

export function AddTeamPlayer({
  team,
  setShow,
}: AddTeamPlayerProps): ReactElement {
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

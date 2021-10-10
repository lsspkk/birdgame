import Link from 'next/link'
import React, { ReactElement, useState, useContext, ChangeEvent } from 'react'
import { Button } from '../components/basic/Button'
import { Message } from '../components/basic/Message'
import { Title } from '../components/basic/Title'
import { BirdIconNoSound } from '../components/Icons'
import { Layout } from '../components/Layout'
import { Avatar, ChooseAvatar, Player } from '../components/Player'
import { basePath } from '../next.config'
import { GameContextInterface, GameContext } from '../components/state'

interface AddTeamPlayerState {
  password: string
  passwordConfirm: string
  avatar: string
}
const emptyAddState: AddTeamPlayerState = {
  password: '',
  passwordConfirm: '',
  avatar: 'girl.svg',
}

export default function Profile(): ReactElement {
  const { user, setUser, score }: GameContextInterface = useContext(GameContext)
  const [addState, setAddState] = useState<AddTeamPlayerState>({
    ...emptyAddState,
    avatar: user.avatar,
  })
  const [message, setMessage] = useState<string>('')

  async function savePassword(): Promise<void> {
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
    const changedData = { password: addState.password }
    put(changedData, 'Salasana tallennettu')
  }
  async function put(
    changedData: { password?: string; avatar?: string },
    message: string,
  ) {
    const res = await fetch(`${basePath}/api/users/${user._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changedData),
    })
    if (res.ok) {
      const savedPlayer = await res.json()

      setUser(savedPlayer)
      localStorage.setItem('user', JSON.stringify(savedPlayer))
      setMessage(message)
      window?.scrollTo(0, 0)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function saveAvatar(): Promise<void> {
    if (addState.avatar === user.avatar) {
      return
    }
    put({ avatar: addState.avatar }, 'Kuva tallennettu')
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setAddState({ ...addState, [event.target.name]: event.target.value })
  }

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <Player user={user} />

        <div className="pr-4">
          {score?.knowledge?.length > 0 && (
            <Link href="/knowledge" passHref>
              <Button className="bg-green-500 font-bold text-white">
                <BirdIconNoSound />
              </Button>
            </Link>
          )}
          {message !== '' && <Message>{message}</Message>}
        </div>
      </div>

      <div className="pt-2 px-4 pb-10">
        <Title>Vaihda salasana</Title>
        <div className="flex items-center">
          <div className="w-20 mr-4">Salasana:</div>
          <input
            className="p-2 border"
            type="password"
            value={addState.password}
            name="password"
            onChange={handleChange}
          ></input>
        </div>
        <div className="flex items-center pt-4">
          <div className="w-20 mr-4">
            Salasana
            <br />
            uudestaan:
          </div>
          <input
            className="p-2 border"
            type="password"
            value={addState.passwordConfirm}
            name="passwordConfirm"
            onChange={handleChange}
          ></input>
        </div>
        <div className="pt-6">
          <Button onClick={() => savePassword()}>Tallenna salasana</Button>
        </div>

        <div className="pt-20">
          <Title>Vaihda kuva</Title>
        </div>
        <div className="flex items-center">
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
        <div className="pt-10">
          <Button onClick={() => saveAvatar()}>Tallenna kuva</Button>
        </div>
      </div>
    </Layout>
  )
}

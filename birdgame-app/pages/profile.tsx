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
import { useTeams } from '../models/swrApi'

interface ProfileState {
  password: string
  passwordConfirm: string
  avatar: string
}
const emptyAddState: ProfileState = {
  password: '',
  passwordConfirm: '',
  avatar: 'girl.svg',
}

export default function Profile(): ReactElement {
  const { user, setUser, score }: GameContextInterface = useContext(GameContext)
  const [state, setState] = useState<ProfileState>({
    ...emptyAddState,
    avatar: user.avatar,
  })
  const [message, setMessage] = useState<string>('')

  const teamsData = useTeams()
  const myTeamName =
    user.teamId !== ''
      ? teamsData.teams.find((t) => t._id === user.teamId)?.name
      : ''
  const addTeamText =
    myTeamName !== '' ? 'Vaihda joukkue' : 'Lisää joukkueeseen'
  console.log(addTeamText, myTeamName)

  async function savePassword(): Promise<void> {
    if (state.password !== state.passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (state.password.trim().length < 4) {
      setMessage('Salasanan pituus ei riitä')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const changedData = { password: state.password }
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
    if (state.avatar === user.avatar) {
      return
    }
    put({ avatar: state.avatar }, 'Kuva tallennettu')
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setState({ ...state, [event.target.name]: event.target.value })
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
      <div className="m-4 flex items-center">
        {myTeamName !== '' && (
          <>
            <div className="mr-4">
              <div className="text-xs">Joukkue</div>
              <Title className="pt-0">{myTeamName}</Title>
            </div>
          </>
        )}
        <Link href="/changeTeam" passHref>
          <Button>{addTeamText}</Button>
        </Link>
      </div>

      <div className="pt-2 px-4 pb-10">
        <Title>Vaihda salasana</Title>
        <div className="flex items-center">
          <div className="w-20 mr-4">Salasana:</div>
          <input
            className="p-2 border"
            type="password"
            value={state.password}
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
            value={state.passwordConfirm}
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
            <Avatar avatar={state.avatar} />
          </div>
          <div>
            {' '}
            <ChooseAvatar
              chosen={state.avatar}
              setAvatar={(avatar) => setState({ ...state, avatar })}
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

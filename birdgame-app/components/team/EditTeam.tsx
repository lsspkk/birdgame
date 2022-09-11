import React, { ChangeEvent, ReactElement, useState } from 'react'
import { Button } from '../basic/Button'
import { Message } from '../basic/Message'
import { Title } from '../basic/Title'
import { getRandomBirdName } from '../../data/levels'
import {
  EditTeamPutBody as TeamUpdateInterface,
  TeamInterface,
} from '../../models/TeamInterface'
import { basePath } from '../../next.config'
import { Player } from '../Player'
import { UsersData, useUsers } from '../../models/swrApi'
import { useRouter } from 'next/dist/client/router'
import { UserInterface } from '../../models/UserInterface'

interface editTeamProps {
  setViewMode: (GroupViewMode) => void
  team: TeamInterface
}
export function EditTeam({ setViewMode, team }: editTeamProps): ReactElement {
  const [name, setName] = useState<string>(team.name)
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [addUserPassword, setAddUserPassword] = useState<string>(
    team.addUserPassword,
  )
  const [message, setMessage] = useState<string>('')
  const data: UsersData = useUsers(team._id)
  const router = useRouter()

  console.log(1, team)

  function cancel(): void {
    setViewMode({ view: 'select' })
    setName('')
    setPassword('')
    setMessage('')
    setAddUserPassword('')
  }
  async function save(): Promise<void> {
    if (password !== passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    if (password.length > 0 && password.length < 4) {
      setMessage('Uusi salasana on liian lyhyt')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const updateBody: TeamUpdateInterface = {}
    if (name !== team.name) {
      updateBody.name = name
    }
    if (addUserPassword !== team.addUserPassword) {
      updateBody.addUserPassword = addUserPassword
    }
    if (password.length > 0) {
      updateBody.password = password
    }
    if (!updateBody || Object.keys(updateBody).length === 0) {
      return
    }
    const res = await fetch(`${basePath}/api/teams/${team._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateBody),
    })
    if (res.ok) {
      // console.log(await res.json())
      router.reload()
    }
  }
  return (
    <div>
      <Title>Muokkaa joukkuetta</Title>

      <div className="flex items-center pt-8">
        <div className="w-20 mr-4">Joukkueen nimi:</div>
        <input
          className="p-2 border"
          type="text"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        ></input>
      </div>
      <p className="pt-12">
        Salasanan avulla voit hallinnoida joukkuetta, poistaa pelaajia jne.
        <br />
        Jätä kentät tyhjiksi jos et halua vaihtaa salasanaa.
      </p>
      <div className="flex items-center pt-4">
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
      <p className="pt-20">
        Valitse lisäyskoodi eli linnun nimi joukkueelle ja kerro se
        kavereillesi. Koodin avulla he voivat lisätä itselleen pelaajan
        joukkueeseen.
      </p>
      <div className="flex items-center pt-6">
        <div className="w-20 mr-4">Lisäyskoodi</div>
        <input
          className="p-2 border"
          type="text"
          value={addUserPassword}
          disabled={true}
        ></input>
        <div
          className="ml-1 p-2 border bg-gray-200 shadow"
          onClick={() => setAddUserPassword(getRandomBirdName())}
        >
          Vaihda
        </div>
      </div>
      <p className="pt-20 text-red-400">
        HUOM: Kirjoita salasana ja lisäyskoodi muistilapulle!
      </p>

      <div className="my-4 flex">
        <Title>Pelaajat</Title>
        {data?.users?.length === 0 && (
          <div className="pr-4">Ei pelaajia joukkueessa</div>
        )}

        {data?.users?.map((u: UserInterface) => (
          <div key={`showUser${u._id}`}>
            <Player user={u} />
          </div>
        ))}
      </div>

      {message !== '' && <Message>{message}</Message>}
      <div className="flex w-full md:w-1/2 justify-around pt-10">
        <Button onClick={() => cancel()}>Peruuta</Button>
        <Button onClick={() => save()}>Tallenna</Button>
      </div>
    </div>
  )
}

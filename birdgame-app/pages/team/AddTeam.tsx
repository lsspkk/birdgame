import { useRouter } from 'next/dist/client/router'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import { Button } from '../../components/basic/Button'
import { Message } from '../../components/basic/Message'
import { Title } from '../../components/basic/Title'
import { getRandomBirdName } from '../../data/levels'
import { TeamInterface } from '../../models/team'
import { basePath } from '../../next.config'

interface addTeamProps {
  setViewMode: (string) => void
}
export function AddTeam({ setViewMode }: addTeamProps): ReactElement {
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [addUserPassword, setAddUserPassword] = useState<string>(
    getRandomBirdName(),
  )
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  function cancel(): void {
    setViewMode('select')
    setName('')
    setPassword('')
    setMessage('')
    setAddUserPassword(getRandomBirdName())
  }
  async function save(): Promise<void> {
    if (password !== passwordConfirm) {
      setMessage('Salasanat eivät täsmää')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    const newTeam: TeamInterface = { name, password, addUserPassword }
    const res = await fetch(`${basePath}/api/teams`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeam),
    })
    if (res.ok) {
      router.reload()
    }
  }
  return (
    <div>
      <Title>Lisää joukkue</Title>

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

      {message !== '' && <Message>{message}</Message>}
      <div className="flex w-full md:w-1/2 justify-around pt-10">
        <Button onClick={() => cancel()}>Peruuta</Button>
        <Button onClick={() => save()}>Lisää</Button>
      </div>
    </div>
  )
}

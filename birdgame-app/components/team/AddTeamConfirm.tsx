import React, { ChangeEvent, ReactElement, useState } from 'react'
import { Button } from '../basic/Button'
import { Message } from '../basic/Message'
import { Title } from '../basic/Title'

interface addTeamProps {
  setViewMode: (string) => void
}
export function AddTeamConfirm({ setViewMode }: addTeamProps): ReactElement {
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  function cancel(): void {
    setViewMode({ view: 'select' })
    setPassword('')
    setMessage('')
  }

  const passwordConfirm = 'marraskuu'
  async function save(): Promise<void> {
    if (password !== passwordConfirm) {
      setMessage('Väärä koodi')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setViewMode({ view: 'add' })
    setPassword('')
    setMessage('')
  }
  return (
    <div>
      <Title>Lisää joukkue</Title>

      <div className="flex items-center pt-8 mx-4 flex-wrap gap-4">
        <div className="w-full">Lisääminen vaatii kutsukoodin</div>
        <div className="w-20 mr-4">Kutsukoodi</div>
        <input
          className="p-2 border"
          type="text"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        ></input>

        {message !== '' && <Message>{message}</Message>}
        <div className="flex w-full md:w-1/2 justify-around pt-6">
          <Button onClick={() => cancel()}>Peruuta</Button>
          <Button className="w-20" onClick={() => save()}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  )
}

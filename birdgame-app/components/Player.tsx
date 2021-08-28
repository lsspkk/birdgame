import React, { ReactElement } from 'react'
import { UserInterface } from '../models/user'

interface UserInterfaceProps {
  user: UserInterface
  onClick?: () => void
}
export function Player({ user }: UserInterfaceProps): ReactElement {
  return (
    <div className="text-center">
      <Avatar avatar={user.avatar} />
      {user.name}
    </div>
  )
}

function avatarUrl(image: string): string {
  const src: string = image === '' ? 'user.svg' : `kid-avatars/svg/${image}`
  return `${process.env.NEXT_PUBLIC_BASE_PATH}${src}`
}

interface AvatarProps {
  avatar: string
}
export function Avatar({ avatar }: AvatarProps): ReactElement {
  return <img className="rounded-full w-20 h-20" src={avatarUrl(avatar)} />
}

import avatarsJson from '../data/avatars.json'
const avatars = [...avatarsJson]

interface ChooseAvatarProps {
  chosen: string
  setAvatar: (string) => void
}
export function ChooseAvatar({
  chosen,
  setAvatar,
}: ChooseAvatarProps): ReactElement {
  return (
    <div className="flex w-full flex-wrap">
      {avatars.map((avatar: string) => {
        const isChosen = chosen === avatar ? 'bg-red-500' : ''
        return (
          <img
            key={`ca${avatar}`}
            className={`w-10 h-10 p-1 ${isChosen}`}
            src={avatarUrl(avatar)}
            onClick={() => chosen !== avatar && setAvatar(avatar)}
          />
        )
      })}
    </div>
  )
}
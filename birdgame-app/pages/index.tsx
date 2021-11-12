import React, { ReactElement, ReactNode, useState } from 'react'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'
import { ImageLevelButton } from '../components/ImageLevelButton'
import { AudioLevelButton } from '../components/AudioLevelButton'
import { BirdIcon, BirdIconNoSound, CloseIcon } from '../components/Icons'

export default function Home(): ReactElement {
  const [state, setState] = useState('menu')
  return (
    <Layout>
      <UserSelectionController />

      {state === 'menu' && (
        <div className="flex flex-col items-center">
          <BirdIconNoSound
            className="w-40 h-40 m-5"
            onClick={() => setState('image')}
          />
          <BirdIcon
            className="w-40 h-40 m-5"
            onClick={() => setState('audio')}
          />
        </div>
      )}

      {state === 'image' && (
        <>
          <GameTypeTitle onClose={() => setState('menu')}>
            <div className="text-pink-500">Kuvan tunnistus</div>
          </GameTypeTitle>

          <div className="flex justify-center text-center flex-wrap">
            <ImageLevelButton level="1" />
            <ImageLevelButton level="2" />
            <ImageLevelButton level="3" />
            <ImageLevelButton level="4" />
            <ImageLevelButton level="5" />
          </div>
        </>
      )}

      {state === 'audio' && (
        <>
          <GameTypeTitle onClose={() => setState('menu')}>
            <div className="text-indigo-500">Äänen tunnistus</div>
          </GameTypeTitle>

          <div className="flex justify-center text-center flex-wrap">
            <AudioLevelButton level="1" />
            <AudioLevelButton level="2" />
            <AudioLevelButton level="3" />
            <AudioLevelButton level="4" />
            <AudioLevelButton level="5" />
          </div>
        </>
      )}
    </Layout>
  )
}

interface Props {
  onClose: () => void
  children: ReactNode
}
function GameTypeTitle({ onClose, children }: Props) {
  return (
    <div className="flex justify-between items-center align-content-center">
      <div className="mt-3 text-2xl">{children}</div>
      <div onClick={onClose}>
        <CloseIcon />
      </div>
    </div>
  )
}

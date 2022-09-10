import React, { ReactElement, ReactNode, useState } from 'react'
import { Layout } from '../components/Layout'
import { ImageLevelButton } from '../components/ImageLevelButton'
import { AudioLevelButton } from '../components/AudioLevelButton'
import { BirdIcon, BirdIconNoSound, CloseIcon } from '../components/Icons'

export default function Home(): ReactElement {
  const [state, setState] = useState('menu')
  return (
    <Layout>
      {state === 'menu' && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center  m-5">
            <BirdIconNoSound
              className="w-40 h-40"
              onClick={() => setState('image')}
            />
            <div>Tunnista kuva</div>
          </div>
          <div className="flex flex-col items-center  m-5">
            <BirdIcon className="w-40 h-40" onClick={() => setState('audio')} />
            <div>Tunnista ääni</div>
          </div>
        </div>
      )}

      {state === 'image' && (
        <>
          <GameTypeTitle onClose={() => setState('menu')}>
            <div className="text-pink-500">Vaikeustaso</div>
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
            <div className="text-indigo-500">Vaikeustaso</div>
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
    <div className="flex justify-between items-center align-content-center pb-1">
      <div className="mt-3 text-2xl">{children}</div>
      <div className="h-10 w-10" onClick={onClose}>
        <CloseIcon />
      </div>
    </div>
  )
}

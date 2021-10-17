import React, { ReactElement } from 'react'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'
import { ImageLevelButton } from '../components/ImageLevelButton'
import { AudioLevelButton } from '../components/AudioLevelButton'

export default function Home(): ReactElement {
  return (
    <Layout>
      <UserSelectionController />

      <p className="mt-3 text-2xl">Kuvan tunnistus</p>

      <div className="flex justify-center text-center flex-wrap">
        <ImageLevelButton level="1" />
        <ImageLevelButton level="2" />
        <ImageLevelButton level="3" />
        <ImageLevelButton level="4" />
        <ImageLevelButton level="5" />
      </div>

      <p className="mt-12 text-2xl">Äänen tunnistus</p>

      <div className="flex justify-center text-center flex-wrap">
        <AudioLevelButton level="1" />
        <AudioLevelButton level="2" />
        <AudioLevelButton level="3" />
        <AudioLevelButton level="4" />
        <AudioLevelButton level="5" />
      </div>
    </Layout>
  )
}

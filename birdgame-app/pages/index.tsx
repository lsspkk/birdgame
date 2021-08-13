import React, { ReactElement } from 'react'
import { BirdIcon } from '../components/Icons'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'
import { ImageLevelButton } from '../components/ImageLevelButton'

export default function Home(): ReactElement {
  return (
    <Layout>
      <div className="text-2xl font-bold flex items-center">
        <BirdIcon /> <div>Lintupeli</div>
      </div>

      <UserSelectionController />

      <p className="mt-3 text-2xl">Valitse tehtävä</p>

      <div className="flex justify-center text-center">
        <ImageLevelButton level="1" />
        <ImageLevelButton level="2" />
        <ImageLevelButton level="3" />
        <ImageLevelButton level="4" />
        <ImageLevelButton level="5" />
      </div>
    </Layout>
  )
}

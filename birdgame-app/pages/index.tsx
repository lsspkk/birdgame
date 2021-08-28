import React, { ReactElement } from 'react'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'
import { ImageLevelButton } from '../components/ImageLevelButton'

export default function Home(): ReactElement {
  return (
    <Layout>
      <UserSelectionController />

      <p className="mt-3 text-2xl">Valitse tehtävä</p>

      <div className="flex justify-center text-center flex-wrap">
        <ImageLevelButton level="1" />
        <ImageLevelButton level="2" />
        <ImageLevelButton level="3" />
        <ImageLevelButton level="4" />
        <ImageLevelButton level="5" />
      </div>
    </Layout>
  )
}

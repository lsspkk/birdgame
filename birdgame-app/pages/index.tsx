import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { PlayIcon, SettingsIcon } from '../components/Icons'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex flex-col items-center justify-between h-full flex-grow">
        <UserSelectionController />

        <div className="flex w-full justify-center">
          <div className="flex flex-col items-center">
            <PlayIcon
              className="h-20 w-40"
              onClick={() => router.push('/gametype')}
            />
            Pelaa
          </div>
        </div>
        <div className="flex w-full flex-col items-center opacity-50">
          <SettingsIcon
            className="h-10 w-10"
            onClick={() => router.push('/settings')}
          />
          <div>Asetukset</div>
        </div>
      </div>
    </Layout>
  )
}

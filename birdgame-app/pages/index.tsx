import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { PlayIcon } from '../components/Icons'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <Layout>
      <UserSelectionController />

      <div className="flex mt-20 w-full justify-center">
        <div className="flex flex-col items-center">
          <PlayIcon
            className="h-20 w-40"
            onClick={() => router.push('/gametype')}
          />
          Pelaa
        </div>
      </div>
    </Layout>
  )
}

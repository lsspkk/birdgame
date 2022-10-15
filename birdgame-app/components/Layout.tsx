import React, { ReactElement, useContext, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { basePath } from '../next.config'
import { GameContext } from './state'
import { BirdIcon, CloseIcon } from './Icons'

export type Props = {
  children?: React.ReactNode
}

function Layout({ children }: Props): ReactElement {
  const router = useRouter()
  const isHome: boolean = router.pathname === '/'
  const isGame: boolean = router.pathname.includes('level')

  const { setUser } = useContext(GameContext)
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    //console.log('savedUser', savedUser)
    if (savedUser !== null) {
      setUser(JSON.parse(savedUser))
    }
  }, [setUser])

  const cName = isGame
    ? ''
    : 'flex flex-col items-center justify-center min-h-screen'
  return (
    <div className={cName}>
      <Head>
        <title>Lintupeli</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      {!isGame && (
        <div className="w-full flex justify-between items-center align-content-center text-blue-100 bg-gray-700  border-b-2 shadow">
          <Link href="/" passHref>
            <div className="flex flex-start items-center">
              <BirdIcon />
              <h1 className="text-xl font-bold">Lintupeli</h1>
            </div>
          </Link>

          {!isHome && (
            <CloseIcon className="h-10 w-10" onClick={() => router.back()} />
          )}
        </div>
      )}
      <main
        className={isGame ? '' : 'container flex flex-col w-full flex-1 p-2'}
      >
        {children}
      </main>

      {isHome && (
        <footer className="flex items-center justify-center w-full p-2 lg:h-24 border-t text-blue-100 bg-gray-700 border-t-2">
          <Link href="/about">Tietoja</Link>
        </footer>
      )}
    </div>
  )
}

export { Layout }

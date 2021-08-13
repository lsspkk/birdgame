import React, { ReactElement, useContext, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { basePath } from '../next.config'
import { GameContext } from './ContextWrapper'

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
    console.log('savedUser', savedUser)
    if (savedUser !== null) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const cName = isGame
    ? ''
    : 'flex flex-col items-center justify-center min-h-screen py-2'
  return (
    <div className={cName}>
      <Head>
        <title>Lintupeli</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>
      <main
        className={isGame ? '' : 'container flex flex-col w-full flex-1 px-20'}
      >
        {children}
      </main>

      {isHome && (
        <footer className="flex items-center justify-center w-full h-24 border-t">
          <Link href="/about">Tietoja</Link>
        </footer>
      )}
    </div>
  )
}

export { Layout }

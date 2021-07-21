import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import { JsxElement } from 'typescript'

const Layout = ({ children }: PropsWithChildren): JsxElement => {
  const router = useRouter()

  const isHome: boolean = router.pathname === '/'
  const isGame: boolean = router.pathname.includes('level')

  const cName = isGame
    ? ''
    : 'flex flex-col items-center justify-center min-h-screen py-2'
  return (
    <div className={cName}>
      <Head>
        <title>Lintupeli</title>
        <link rel="icon" href="/favicon.ico" />
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

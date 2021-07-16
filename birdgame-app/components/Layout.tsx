import Head from 'next/head'
import Link from 'next/link'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Lintupeli</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col w-full flex-1 px-20">
        {children}
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <Link href="/about">Tietoja</Link>
      </footer>

    </div>
  )
}

export { Layout }

import 'tailwindcss/tailwind.css'
import '../styles/animations.css'
import React, { ReactElement } from 'react'
import { AppProps } from 'next/app'
import { ContextWrapper } from '../components/state'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <title>Lintupeli</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <ContextWrapper>
        <Component {...pageProps} />
      </ContextWrapper>
    </>
  )
}

export default MyApp

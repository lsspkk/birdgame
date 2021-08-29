import 'tailwindcss/tailwind.css'
import React, { ReactElement } from 'react'
import { AppProps } from 'next/app'
import { ContextWrapper } from '../components/state'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ContextWrapper>
      <Component {...pageProps} />
    </ContextWrapper>
  )
}

export default MyApp

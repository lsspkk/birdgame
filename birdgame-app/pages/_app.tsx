import 'tailwindcss/tailwind.css'
import React from 'react'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />
}

export default MyApp

import 'tailwindcss/tailwind.css'
import React from 'react'

interface Props {
  Component: any
  pageProps: any
}
function MyApp({ Component, pageProps }: Props): React.ReactElement {
  return <Component {...pageProps} />
}

export default MyApp

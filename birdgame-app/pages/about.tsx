import React, { ReactElement } from 'react'

import { Layout } from '../components/Layout'

export default function About(): ReactElement {
  return (
    <Layout>
      <div>
        <p className="mt-6 mb-3 text-4xl">Lintujen kuvat</p>
        <p className="mt-3 text-xl">
          Lisenssi:{' '}
          <a href="https://creativecommons.org/licenses/by/2.0/">
            https://creativecommons.org/licenses/by/2.0/
          </a>
          <br />
          Valokuvaajia on useita, flickr-alustalle kuvia lähettäneitä.
          <br />
          Esimerkiksi{' '}
          <a href="https://www.flickr.com/people/sbern/">
            https://www.flickr.com/people/sbern/
          </a>
          <br />
        </p>
      </div>

      <div>
        <p className="mt-6 mb-3 text-4xl">Lintujen äänet</p>
        <p className="mt-3 text-xl">
          Lisenssi:{' '}
          <a href="https://creativecommons.org/licenses/by-nc-nd/2.5/">
            https://creativecommons.org/licenses/by-nc-nd/2.5/
          </a>
          <br />
          Sivusto:{' '}
          <a href="https://www.xeno-canto.org">https://www.xeno-canto.org</a>
          <br />
        </p>
      </div>
    </Layout>
  )
}

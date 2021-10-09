import React, { ReactElement } from 'react'

import { Layout } from '../../components/Layout'
import { SpinningStar, StarCircle } from '../../components/StarCircle'

// for testing the level random generators
export default function Random(): ReactElement {
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <Layout>
      <div className="container flex">Hello</div>
      <SpinningStar />
      {scores.map((s) => (
        <div
          style={{ display: 'block', width: '100px', height: '100px' }}
          key={s}
        >
          {s} <StarCircle stars={s} />
        </div>
      ))}
      <SpinningStar shadow />
    </Layout>
  )
}

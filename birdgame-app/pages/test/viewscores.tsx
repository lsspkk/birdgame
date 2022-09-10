import React, { ReactElement } from 'react'
import { PlayIcon, TeamIcon, TelescopeIcon } from '../../components/Icons'

import { Layout } from '../../components/Layout'
import { SpinningStar, StarCircle } from '../../components/StarCircle'

// for testing the level random generators
export default function Random(): ReactElement {
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <Layout>
      <div className="container flex">Hello</div>
      <SpinningStar />
      <SpinningStar shadow />
      <PlayIcon className="text-red-200 h-20 w-40" />
      <TeamIcon className="text-red-200 h-20 w-40" />
      <TelescopeIcon className="text-red-200 h-20 w-40" />

      {scores.map((s) => (
        <div
          style={{ display: 'block', width: '100px', height: '100px' }}
          key={s}
        >
          {s} <StarCircle stars={s} />
        </div>
      ))}
    </Layout>
  )
}

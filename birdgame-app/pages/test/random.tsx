import React, { ReactElement } from 'react'

import { Layout } from '../../components/Layout'
import { getBirds, newLevel, Question } from '../../data/levels'

// for testing the level random generators
export default function Random(): ReactElement {
  const someBirds = getBirds(1, true)
  const level1: Question[] = newLevel(3, true, undefined)
  const level2: Question[] = newLevel(2, true, undefined)

  return (
    <Layout>
      {someBirds.map((b: string, i: number) => (
        <div className="inline-block float-left" key={`lone${i}${b}`}>
          {b}
        </div>
      ))}

      <hr />
      <h1>Taso 3</h1>
      {level1.map((q: Question, i: number) => (
        <div key={`level1${i}${JSON.stringify(q)}`}>
          <div className="bold">
            {q.rightAnswer} - {q.choises.toString()}
          </div>
        </div>
      ))}

      <hr />
      <h1>Taso 2</h1>
      {level2.map((q: Question, i: number) => (
        <div key={`level2${i}${JSON.stringify(q)}`}>
          <div className="bold">
            {q.rightAnswer} - {q.choises.toString()}
          </div>
        </div>
      ))}
    </Layout>
  )
}

import React from 'react'
import { Layout } from '../../components/Layout'
import { getBirds, newLevel, Question } from '../../data/levels'

export default function Home(): React.ReactElement {
  const someBirds = getBirds(1, true)
  const level1: Question[] = newLevel(3, true, undefined)
  const level2: Question[] = newLevel(3, true, undefined)

  return (
    <Layout>
      {someBirds.map((b: string, i: number) => (
        <div className="inline-block float-left" key={`lone${i}${b}`}>
          {b}
        </div>
      ))}

      <hr />
      {level1.map((q: Question, i: number) => (
        <div key={`level1${i}${JSON.stringify(q)}`}>
          <div className="bold">
            {q.rightAnswer} - {q.choises.toString()}
          </div>
        </div>
      ))}
      <hr />

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
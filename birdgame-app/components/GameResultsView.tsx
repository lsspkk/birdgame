import React, { ReactElement } from 'react'
import { IGameResult } from '../models/score'

interface GrvProps {
  results: IGameResult[]
}
export function GameResultsView({ results }: GrvProps): ReactElement {
  return (
    <div>
      {results.map((r: IGameResult) => {
        return <GameResultView key={`grv${r._id}`} result={r} />
      })}
    </div>
  )
}
interface GrProps {
  result: IGameResult
}

export function GameResultView({ result }: GrProps): ReactElement {
  return (
    <div>
      <div className="text-2xl">{result.level}</div>
    </div>
  )
}

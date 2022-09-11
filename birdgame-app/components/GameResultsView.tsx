import React, { ReactElement } from 'react'
import { settings } from '../data/settings'
import { IGameResult } from '../models/ScoreInterface'

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
  const questionAmount = settings.levels.find(
    (i) => i.level === parseInt(result.level),
  )?.questions

  return (
    <div className="flex column justify-start self-center py-6 items-center">
      <div className="text-xl pl-5">
        <div>Taso {result.level}</div>
        <div className="text-xs"> max pisteet: {questionAmount}</div>
      </div>
      <div className="flex items-center justify-center">
        <div className="self-justify-end text-xl pr-10"></div>
        <div className="flex justify-start items-end w-40">
          {result.scores.map((s, i) => (
            <div key={`grvscore${result.level}${s}.${i}`}>
              <div
                style={{
                  display: 'block',
                  width: '20px',
                  height: `${(10 / questionAmount) * s * 10}px`,
                  background: `rgba(50,${20 * parseInt(result.level) + 50},
                    ${20 * parseInt(result.level) + 100},1)`,
                }}
              />
              <div className="text-xs text-center">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

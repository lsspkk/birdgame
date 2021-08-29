import React, { ReactElement } from 'react'
import { IBirdKnowledge } from '../models/score'

interface GkvProps {
  knowledge: IBirdKnowledge[]
}

export function GameKnowledgeView({ knowledge }: GkvProps): ReactElement {
  return (
    <div className="w-1/3 bg-red-200 p-4">
      {JSON.stringify(knowledge, undefined, 2)}
    </div>
  )
}

import React, { ReactElement } from 'react'
import { IBirdKnowledge } from '../models/IGameResult'
import Link from 'next/link'
import { Button } from '../components/basic/Button'
import { BirdIconNoSound } from '../components/Icons'

interface GkvProps {
  knowledge: IBirdKnowledge[]
}

export function GameKnowledgeView({ knowledge }: GkvProps): ReactElement {
  if (knowledge.length === 0) {
    return undefined
  }
  return (
    <div className="w-full flex justify-center">
      <Link href="/knowledge" passHref>
        <Button className="bg-green-500 font-bold text-white">
          <BirdIconNoSound />
        </Button>
      </Link>
    </div>
  )
}

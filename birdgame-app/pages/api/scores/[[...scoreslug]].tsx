import {
  IBirdKnowledge,
  emptyScore,
  IGameResult,
  Score,
  ScoreInterface,
} from '../../../models/score'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'
import { User } from '../../../models/user'

interface ScoreBody {
  userId: string
  knowledge: IBirdKnowledge[]
  gameResult: IGameResult
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await dbConnect()
    if (req.method === 'POST') {
      const body: ScoreBody = req.body
      console.log(body)
      save(body, res)
    }
    if (req.method === 'GET') {
      const { scoreslug } = req.query
      console.log(scoreslug)
      getScores(scoreslug, res)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}
function updateOldScore(oldScore: ScoreInterface, body: ScoreBody) {
  const newResult = body.gameResult
  const oldResultIndex = oldScore.results.findIndex(
    (r) => r.level === newResult.level,
  )
  if (oldResultIndex) {
    oldScore.results[oldResultIndex].scores.push(newResult.scores[0])
  } else {
    oldScore.results.push(newResult)
  }

  body.knowledge.forEach((k) => {
    const matchIndex = oldScore.knowledge.findIndex((o) => o.bird === k.bird)
    if (matchIndex) {
      const oldK = oldScore.knowledge[matchIndex]
      oldK.rightImageAnswers += k.rightImageAnswers
      oldK.wrongImageAnswers += k.wrongImageAnswers
      oldK.rightAudioAnswers += k.rightAudioAnswers
      oldK.wrongAudioAnswers += k.wrongImageAnswers
    }
  })
}
async function save(body: ScoreBody, res: NextApiResponse) {
  const oldScore: ScoreInterface = await Score.findOne({
    userId: body.userId,
  }).exec()

  if (oldScore == null) {
    const newScore = new Score({
      lastPlayed: new Date(),
      userId: body.userId,
      knowledge: body.knowledge,
      results: [body.gameResult],
    })
    newScore.save()
    console.log('newScore', newScore)
    res.status(201).json(newScore)
  } else {
    updateOldScore(oldScore, body)
    const newScore = oldScore.save()
    console.log('oldScore', newScore)
    res.status(200).json(newScore)
  }
}

async function getScores(scoreslug: string | string[], res: NextApiResponse) {
  const teamScores = Array.isArray(scoreslug) && scoreslug[0] === 'team'
  const userScores = Array.isArray(scoreslug) && scoreslug[0] === 'user'
  if (teamScores) {
    console.log('team', scoreslug[1])
    const users = await User.find({ teamId: scoreslug[1] }).select('_id').exec()
    console.log(users)
    if (users.length === 0) {
      res.status(404).json([])
    } else {
      const scores = await Score.find({
        userId: { $in: users.map((u) => u._id) },
      }).exec()
      console.log(scores)
      res.status(200).json(scores)
    }
  }
  if (userScores) {
    console.log('user', scoreslug[1])
    const score = await Score.findOne({ userId: scoreslug[1] }).exec()
    if (score == null) {
      res.status(404).json(emptyScore)
    } else {
      res.status(200).json(score)
    }
  }
}

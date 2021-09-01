import {
  emptyScore,
  Score,
  ScoreInterface,
  ScoreBody,
  updateOldScore,
} from '../../../models/score'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'
import { User } from '../../../models/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await dbConnect()
    if (req.method === 'POST') {
      const body: ScoreBody = req.body
      save(body, res)
    }
    if (req.method === 'GET') {
      const { scoreslug } = req.query
      getScores(scoreslug, res)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

async function save(body: ScoreBody, res: NextApiResponse) {
  const oldScore: ScoreInterface = await Score.findOne({
    userId: body.userId,
  }).exec()

  if (oldScore === null) {
    const newScore = new Score({
      lastPlayed: new Date(),
      userId: body.userId,
      knowledge: body.knowledge,
      results: [body.gameResult],
    })
    newScore.save()
    res.status(201).json(newScore)
  } else {
    updateOldScore(oldScore, body)
    const newScore = await oldScore.save()
    res.status(200).json(newScore)
  }
}

async function getScores(scoreslug: string | string[], res: NextApiResponse) {
  const teamScores = Array.isArray(scoreslug) && scoreslug[0] === 'team'
  const userScores = Array.isArray(scoreslug) && scoreslug[0] === 'user'
  try {
    if (teamScores) {
      const users = await User.find({ teamId: scoreslug[1] })
        .select('_id')
        .exec()
      if (users.length === 0) {
        res.status(404).json([])
      } else {
        const scores = await Score.find({
          userId: { $in: users.map((u) => u._id) },
        }).exec()
        res.status(200).json(scores)
      }
    }
    if (userScores) {
      const score = await Score.findOne({ userId: scoreslug[1] })
        .select('-__id')
        .exec()
      if (score === null) {
        res.status(404).json(emptyScore)
      } else {
        res.status(200).json(score)
      }
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

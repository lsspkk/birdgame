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
      save(body, res)
    }
    if (req.method === 'GET') {
      const { scoreslug } = req.query
      console.log(scoreslug)
      getScores(scoreslug, res)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}
function updateOldScore(oldScore: ScoreInterface, body: ScoreBody) {
  const newResult = body.gameResult
  // newResult.level will be number, oldScore has string
  const oldResultIndex = oldScore.results.findIndex(
    (r) => r.level === `${newResult.level}`,
  )

  if (oldResultIndex !== -1) {
    // keep 10 latest results
    const oldScores = oldScore.results[oldResultIndex].scores
    const newScore = newResult.scores[0]
    const newScores =
      oldScores.length === 10
        ? [...oldScores.slice(1), newScore]
        : [...oldScores, newScore]
    console.log(newScores)
    oldScore.results[oldResultIndex].scores = newScores
  } else {
    oldScore.results.push(newResult)
  }

  const oldBirds = oldScore.knowledge.map((o) => o.bird)

  const oldKnowledge = body.knowledge
    .filter((k) => oldBirds.includes(k.bird))
    .map((k) => {
      const updated = oldScore.knowledge.find((o) => o.bird === k.bird)
      updated.rightImageAnswers += k.rightImageAnswers
      updated.wrongImageAnswers += k.wrongImageAnswers
      updated.rightAudioAnswers += k.rightAudioAnswers
      updated.wrongAudioAnswers += k.wrongImageAnswers
      return updated
    })
  const newKnowledge = body.knowledge.filter((k) => !oldBirds.includes(k.bird))
  oldScore.knowledge = [...oldKnowledge, ...newKnowledge]
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
    console.log('newScore', newScore)
    res.status(201).json(newScore)
  } else {
    console.log('oldScore', oldScore)
    updateOldScore(oldScore, body)
    const newScore = await oldScore.save()
    console.log('newScore', newScore)
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
    const score = await Score.findOne({ userId: scoreslug[1] })
      .select('-__id')
      .exec()
    if (score === null) {
      res.status(404).json(emptyScore)
    } else {
      res.status(200).json(score)
    }
  }
}

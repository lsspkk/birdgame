import { Team } from '../../models/team'
import { TeamInterface } from '../../models/TeamInterface'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import dbConnect from '../../models/dbConnect'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  // TODO add rate limit... create 1/hour 5/day
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const teams: Array<TeamInterface> = await Team.find({})
        .select('-__v -password -addUserPassword')
        .exec()
      res.status(200).json(teams)
    }

    if (req.method === 'POST') {
      const team = req.body as TeamInterface
      const hashedPassword: string = await bcrypt.hash(team.password, 2)
      const hashedTeam = { ...team, password: hashedPassword }
      const saved = await Team.create(hashedTeam)
      res.status(201).json(saved)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

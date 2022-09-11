import { Team } from '../../../models/team'
import { TeamInterface, TeamLogin } from '../../../models/TeamInterface'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(400)
  } else {
    const body: TeamLogin = req.body
    console.log(body)
    const team: TeamInterface = await Team.findOne({ _id: body.id }).exec()
    console.log(team)
    const ok = await bcrypt.compare(body.password, team.password)
    res.status(ok ? 200 : 401).json(team)
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
}

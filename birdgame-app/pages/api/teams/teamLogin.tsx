import { TeamInterface, TeamLogin } from '../../../models/team'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeamInterface[]>,
): void {
  if (req.method !== 'POST') {
    res.status(400)
  } else {
    const body: TeamLogin = req.body
    console.log(body)
    const ok = body.password === 'test'
    res.status(ok ? 200 : 401)
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
}

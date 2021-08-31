import { User, UserInterface, UserLoginInterface } from '../../../models/user'
import bcrypt from 'bcrypt'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(400)
  } else {
    const body: UserLoginInterface = req.body
    const u: UserInterface = await User.findOne({ _id: body.userId }).exec()
    const ok = await bcrypt.compare(body.password, u.password)

    res.status(ok ? 200 : 401).json({})
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
}

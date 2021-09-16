import { User, UserInterface } from '../../../models/user'
import bcrypt from 'bcrypt'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await dbConnect()

    if (req.method === 'POST') {
      const hashedPassword: string = await bcrypt.hash(req.body.password, 2)
      const hashedUser = new User({
        ...req.body,
        password: hashedPassword,
        teamId: '',
      })
      await hashedUser.save()
      delete hashedUser.password
      res.status(201).json(hashedUser)
    }

    if (req.method === 'GET') {
      const players: Array<UserInterface> = await User.find({
        teamId: '',
      })
        .select('-password -__v')
        .exec()
      console.log('-------------------')
      console.log(players)
      res.status(200).json(players)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

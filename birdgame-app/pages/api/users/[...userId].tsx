import { User } from '../../../models/user'
import { UserInterface } from '../../../models/UserInterface'
import bcrypt from 'bcrypt'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { userId } = req.query

  try {
    await dbConnect()
    if (req.method === 'PUT') {
      const user: UserInterface = await User.findById(userId[0])

      if (user === undefined) {
        res.status(401).json({ error: `käyttäjää ${userId[0]} ei löydy` })
      } else {
        if (req.body.password !== undefined) {
          const hashedPassword: string = await bcrypt.hash(req.body.password, 2)
          user['password'] = hashedPassword
        } else if (req.body.avatar !== undefined) {
          user['avatar'] = req.body.avatar
        }
        console.log('updating user', user)
        await user.save()
        delete user.password
        res.status(201).json(user)
      }
    }
    if (req.method === 'GET') {
      const users: Array<UserInterface> = await User.find({
        _id: userId[0],
      })
        .select('-password -__v')
        .exec()
      if (!users || users.length === 0) {
        res.status(404).json({})
        return
      }
      res.status(200).json(users[0])
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

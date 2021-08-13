import { User, UserInterface } from '../../../models/user'
import bcrypt from 'bcrypt'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'
import { Team, TeamInterface } from '../../../models/team'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { slug } = req.query

  const isAddUser = Array.isArray(slug) && slug[1] === 'add'

  try {
    await dbConnect()
    if (req.method === 'POST' && isAddUser) {
      const team: TeamInterface = await Team.findById(slug[0])
        .select('addUserPassword')
        .exec()

      console.log(req.body)
      if (team.addUserPassword !== req.body.addUserPassword) {
        res.status(401).json({ error: 'väärä lisäyskoodi' })
      } else {
        const hashedPassword: string = await bcrypt.hash(req.body.password, 2)
        const hashedUser = new User({
          ...req.body,
          password: hashedPassword,
          teamId: slug[0],
        })
        await hashedUser.save()
        delete hashedUser.password
        console.log(hashedUser)
        res.status(201).json(hashedUser)
      }
    }
    if (req.method === 'GET') {
      const players: Array<UserInterface> = await User.find({
        teamId: slug[0],
      })
        .select('-password -__v')
        .exec()
      console.log(players)
      res.status(200).json(players)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

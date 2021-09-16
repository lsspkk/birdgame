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

    // save new user into team
    if (req.method === 'POST' && isAddUser) {
      const teamOk = checkTeamPassword(res, slug[0], req.body.addUserPassword)

      if (teamOk) {
        const hashedPassword: string = await bcrypt.hash(req.body.password, 2)
        const hashedUser = new User({
          ...req.body,
          password: hashedPassword,
          teamId: slug[0],
        })
        await hashedUser.save()
        delete hashedUser.password
        res.status(201).json(hashedUser)
      }
    }
    // change team of existing user
    if (req.method === 'PUT') {
      const teamOk = checkTeamPassword(res, slug[0], req.body.addUserPassword)
      if (teamOk) {
        const user = await User.findById(req.body.userId).exec()
        if (user === null) {
          res.status(400).json({ error: 'no user found with userId' })
          return
        }
        user.teamId = slug[0]
        await user.save()
        res.status(200).json(user)
      }
    }

    if (req.method === 'GET') {
      const players: Array<UserInterface> = await User.find({
        teamId: slug[0],
      })
        .select('-password -__v')
        .exec()
      res.status(200).json(players)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
async function checkTeamPassword(
  res: NextApiResponse,
  teamId: string,
  addUserPassword: string,
) {
  const team: TeamInterface = await Team.findById(teamId)
    .select('addUserPassword')
    .exec()

  if (team.addUserPassword !== addUserPassword) {
    res.status(401).json({ error: 'väärä lisäyskoodi' })
    return false
  }
  return true
}

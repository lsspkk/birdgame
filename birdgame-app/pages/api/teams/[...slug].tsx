import { User, UserInterface } from '../../../models/user'
import bcrypt from 'bcrypt'

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../models/dbConnect'
import { EditTeamPutBody, Team, TeamInterface } from '../../../models/team'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { slug } = req.query

  const isAddUser = Array.isArray(slug) && slug[1] === 'add'
  const isGetAddUserPassword = Array.isArray(slug) && slug[1] === 'secret'

  try {
    await dbConnect()
    if (req.method === 'POST' && isAddUser) {
      const team: TeamInterface = await Team.findById(slug[0])
        .select('addUserPassword')
        .exec()

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
        res.status(201).json(hashedUser)
      }
    }
    if (req.method === 'POST' && isGetAddUserPassword) {
      const team: TeamInterface = await Team.findById(slug[0])
        .select('addUserPassword')
        .exec()
      res.status(200).json(team)
    }
    if (req.method === 'GET') {
      const players: Array<UserInterface> = await User.find({
        teamId: slug[0],
      })
        .select('-password -__v')
        .exec()
      res.status(200).json(players)
    }

    if (req.method === 'PUT') {
      console.log('have fun')
      const team: TeamInterface = await Team.findById(slug[0])
        .select('addUserPassword')
        .exec()
      const body = req.body as EditTeamPutBody
      if (body.addUserPassword) {
        team.addUserPassword = body.addUserPassword
      }
      if (body.name) {
        team.name = body.name
      }
      if (team.password) {
        const hashedPassword: string = await bcrypt.hash(body.password, 2)
        team.password = hashedPassword
      }
      const savedTeam = await team.save()
      res.status(200).json(savedTeam)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

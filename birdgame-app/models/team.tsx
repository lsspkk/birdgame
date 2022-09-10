import mongoose, { Schema, model } from 'mongoose'
import { TeamInterface } from './TeamInterface'
const TeamSchema = new Schema<TeamInterface>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  addUserPassword: { type: String, required: true },
})

export const Team =
  mongoose.models?.Team || model<TeamInterface>('Team', TeamSchema)

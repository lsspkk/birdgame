import mongoose, { Schema, model, Document } from 'mongoose'
export interface TeamInterface extends Partial<Document> {
  id?: string
  name: string
  password: string
  addUserPassword: string
}

export function isAnonymous(teamId: string | undefined): boolean {
  console.log(1, teamId)
  return teamId === undefined || teamId === ''
}

export const emptyTeam = {
  id: '',
  name: '',
}

export interface TeamLogin {
  id: string
  password: string
}
export interface TeamAddUser {
  id: string
  addUserPassword: string
}

const TeamSchema = new Schema<TeamInterface>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  addUserPassword: { type: String, required: true },
})

export const Team =
  mongoose.models?.Team || model<TeamInterface>('Team', TeamSchema)

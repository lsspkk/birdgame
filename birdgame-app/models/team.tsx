import mongoose, { Schema, model, Document } from 'mongoose'
export interface TeamInterface extends Partial<Document> {
  id?: string
  name: string
  password: string
  addUserPassword: string
}

export const emptyTeam = {
  id: '',
  name: '',
}

export interface TeamLogin {
  id: string
  password: string
}

export interface EditTeamPutBody {
  name?: string
  password?: string
  addUserPassword?: string
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

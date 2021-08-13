import mongoose, { Schema, model, Document } from 'mongoose'
export interface UserInterface extends Partial<Document> {
  name: string
  avatar: string
  teamId?: string
  teamName?: string
  password?: string
  addUserPassword?: string
}

export interface UserLoginInterface {
  userId: string
  teamId: string
  password: string
}

export const emptyUser = {
  name: 'Nimetön',
  avatar: '',
  teamId: '',
  teamName: '',
}

const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  teamId: { type: String, required: true },
})

export const User =
  mongoose.models?.User || model<UserInterface>('User', UserSchema)

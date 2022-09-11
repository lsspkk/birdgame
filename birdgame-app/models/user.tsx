import mongoose, { Schema, model, Model } from 'mongoose'
import { UserInterface } from './UserInterface'
export const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  teamId: { type: String, required: true },
})

export const User = (mongoose.models?.User ||
  model<UserInterface>('User', UserSchema)) as unknown as Model<UserInterface>

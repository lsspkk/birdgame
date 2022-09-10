import { Document } from 'mongoose'

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

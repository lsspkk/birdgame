import mongoose, { Schema, model, Document } from 'mongoose'
import { UserInterface } from './user'

export interface IGameResult extends Partial<Document> {
  level: string
  isImage: boolean
  scores: number[]
}
export interface IBirdKnowledge extends Partial<Document> {
  bird: string
  rightImageAnswers: number
  wrongImageAnswers: number
  rightAudioAnswers: number
  wrongAudioAnswers: number
}

export const emptyBirdKnowledge: IBirdKnowledge = {
  bird: '',
  rightImageAnswers: 0,
  rightAudioAnswers: 0,
  wrongImageAnswers: 0,
  wrongAudioAnswers: 0,
}
export interface ScoreInterface extends Partial<Document> {
  results: IGameResult[]
  knowledge: IBirdKnowledge[]
  lastPlayed?: Date
  user?: UserInterface
}

export const emptyScore: ScoreInterface = {
  results: [],
  knowledge: [],
}

const ScoreSchema = new Schema<ScoreInterface>({
  results: [
    {
      level: { type: String, required: true },
      isImage: { type: Boolean, required: true },
      scores: [{ type: Number, required: true }],
    },
  ],
  knowledge: [
    {
      bird: { type: String, required: true },
      rightImageAnswers: { type: Number, required: false },
      wrongImageAnswers: { type: Number, required: false },
      rightAudioAnswers: { type: Number, required: false },
      wrongAudioAnswers: { type: Number, required: false },
    },
  ],
  userId: { type: String, required: true },
  lastPlayed: Date,
})

export const Score =
  mongoose.models?.Score || model<ScoreInterface>('Score', ScoreSchema)

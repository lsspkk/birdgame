import mongoose, { Schema, model } from 'mongoose'
import { ScoreInterface } from './IGameResult'

const ScoreSchema = new Schema<ScoreInterface>({
  results: [
    {
      level: { type: String, required: true },
      resultType: { type: String, required: true },
      scores: [{ type: Number, required: true }],
    },
  ],
  knowledge: [
    {
      bird: { type: String, required: true },
      answers: [
        {
          answerType: { type: String, required: true },
          right: { type: Number, required: true },
          wrong: { type: Number, required: true },
        },
      ],
    },
  ],
  userId: { type: String, required: true },
  lastPlayed: Date,
})

export const Score =
  mongoose.models?.Score || model<ScoreInterface>('Score', ScoreSchema)

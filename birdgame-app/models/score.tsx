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

// post body to api/scores
export interface ScoreBody {
  userId: string
  knowledge: IBirdKnowledge[]
  gameResult: IGameResult
}

// updating old score at api/scores
export function updateOldScore(
  oldScore: ScoreInterface,
  body: ScoreBody,
): void {
  const newResult = body.gameResult
  // newResult.level will be number, oldScore has string
  const oldResultIndex = oldScore.results.findIndex(
    (r) => r.level === `${newResult.level}`,
  )

  if (oldResultIndex !== -1) {
    // keep 10 latest results
    const oldScores = oldScore.results[oldResultIndex].scores
    const newScore = newResult.scores[0]
    const newScores =
      oldScores.length === 10
        ? [...oldScores.slice(1), newScore]
        : [...oldScores, newScore]
    oldScore.results[oldResultIndex].scores = newScores
  } else {
    oldScore.results.push(newResult)
  }

  const oldBirds = oldScore.knowledge.map((k) => k.bird)

  const changedKnowledge = body.knowledge
    .filter((k) => oldBirds.includes(k.bird))
    .map((k) => {
      const updated = { ...oldScore.knowledge.find((o) => o.bird === k.bird) }
      updated.rightImageAnswers += k.rightImageAnswers
      updated.wrongImageAnswers += k.wrongImageAnswers
      updated.rightAudioAnswers += k.rightAudioAnswers
      updated.wrongAudioAnswers += k.wrongImageAnswers
      return updated
    })
  const newKnowledge = body.knowledge.filter((k) => !oldBirds.includes(k.bird))
  const changedBirds = changedKnowledge.map((k) => k.bird)
  const unchangedKnowledge = oldScore.knowledge.filter(
    (k) => !changedBirds.includes(k.bird),
  )
  oldScore.knowledge = [
    ...unchangedKnowledge,
    ...changedKnowledge,
    ...newKnowledge,
  ]
  oldScore.knowledge.sort((a, b) => {
    if (a.rightImageAnswers < b.rightImageAnswers) return 1
    if (b.rightImageAnswers < a.rightImageAnswers) return -1
    return 0
  })
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

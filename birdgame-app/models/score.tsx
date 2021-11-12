import mongoose, { Schema, model, Document } from 'mongoose'
import { UserInterface } from './user'

export interface IGameResult extends Partial<Document> {
  level: string
  resultType: 'image' | 'audio'
  scores: number[]
}
export interface IBirdKnowledge extends Partial<Document> {
  bird: string
  answers: {
    answerType: 'image' | 'audio'
    right: number
    wrong: number
  }[]
}

export const emptyBirdKnowledge: IBirdKnowledge = {
  bird: '',
  answers: [
    { answerType: 'image', right: 0, wrong: 0 },
    { answerType: 'audio', right: 0, wrong: 0 },
  ],
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
    (r) =>
      r.level === `${newResult.level}` &&
      r.resultType === body.gameResult.resultType,
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

  const changedKnowledge = body.knowledge.filter((k) =>
    oldBirds.includes(k.bird),
  )

  changedKnowledge.forEach((k) => {
    const audio = k.answers.find((a) => a.answerType === 'audio')
    const image = k.answers.find((a) => a.answerType === 'image')
    const updated = oldScore.knowledge.find((o) => o.bird === k.bird)
    updated?.answers.forEach((a) => {
      if (a.answerType === 'audio') {
        a.right += audio.right
        a.wrong += audio.wrong
      }
      if (a.answerType === 'image') {
        a.right += image.right
        a.wrong += image.wrong
      }
    })
  })

  const newKnowledge = body.knowledge.filter((k) => !oldBirds.includes(k.bird))
  newKnowledge.forEach((k) => oldScore.knowledge.push(k))
  oldScore.knowledge.forEach((k) => delete k._id)
  oldScore.knowledge.sort((a, b) => {
    const rightA = a.answers.map((an) => an.right).reduce((p, c) => p + c)
    const rightB = b.answers.map((an) => an.right).reduce((p, c) => p + c)

    if (rightA < rightB) return 1
    if (rightB < rightA) return -1
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

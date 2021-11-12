import React, { ReactElement } from 'react'

import { Layout } from '../../components/Layout'
import { ScoreBody, ScoreInterface, updateOldScore } from '../../models/score'

const oldKnowledge: ScoreInterface = {
  lastPlayed: new Date(),
  knowledge: [
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bc' },
      bird: 'Kuikka',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bd' },
      bird: 'Kultarinta',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7be' },
      bird: 'Hömötiainen',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bf' },
      bird: 'Telkkä',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c08' },
      bird: 'Sinitiainen',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c9' },
      bird: 'Keltasirkku',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7cd' },
      bird: 'Isokoskelo',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7cd' },
      bird: 'Harmaahaikara',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c4' },
      bird: 'Tilhi',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c5' },
      bird: 'Keltavästäräkki',
      answers: [
        { answerType: 'image', right: 1, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
  ],
  results: [
    {
      scores: [5, 9],
      _id: { $oid: '61174ce16769f33d4088662d' },
      level: '1',
      resultType: 'image',
    },
    {
      scores: [14, 2, 11, 2],
      _id: { $oid: '612bb118ae1c8510cdadc99a' },
      level: '2',
      resultType: 'image',
    },
    {
      scores: [9, 9],
      _id: { $oid: '612bbf280dfc3d001c981d5c' },
      level: '3',
      resultType: 'image',
    },
  ],
  __v: 30,
}

const body: ScoreBody = {
  userId: '234234',
  gameResult: { scores: [11], level: '3', resultType: 'image' },
  knowledge: [
    {
      bird: 'Keltasirkku',
      answers: [
        {
          answerType: 'image',
          right: 2,
          wrong: 0,
        },
        {
          answerType: 'audio',
          right: 0,
          wrong: 0,
        },
      ],
    },
    {
      bird: 'Peltosirkku',
      answers: [
        { answerType: 'image', right: 3, wrong: 0 },
        {
          answerType: 'audio',
          right: 0,

          wrong: 0,
        },
      ],
    },
  ],
}

// for testing the level random generators
export default function Random(): ReactElement {
  const copy = { ...oldKnowledge }
  updateOldScore(copy, body)
  return (
    <Layout>
      <table>
        <tr>
          <th></th>
          <th>
            Kuvantunnistus
            <br />
            Oikein/Väärin
          </th>
        </tr>
        {copy.knowledge.map((k) => (
          <tr key={JSON.stringify(k)}>
            <td>{k.bird}</td>
            <td className="text-center">
              {k.answers.find((a) => a.answerType === 'image')?.right}
            </td>
          </tr>
        ))}
      </table>
    </Layout>
  )
}

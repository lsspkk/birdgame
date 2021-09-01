import React, { ReactElement } from 'react'

import { Layout } from '../../components/Layout'
import { ScoreBody, ScoreInterface, updateOldScore } from '../../models/score'

const oldKnowledge: ScoreInterface = {
  lastPlayed: new Date(),
  knowledge: [
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bc' },
      bird: 'Kuikka',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bd' },
      bird: 'Kultarinta',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7be' },
      bird: 'Hömötiainen',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7bf' },
      bird: 'Telkkä',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c08' },
      bird: 'Sinitiainen',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c9' },
      bird: 'Keltasirkku',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7cd' },
      bird: 'Isokoskelo',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7cd' },
      bird: 'Harmaahaikara',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c4' },
      bird: 'Tilhi',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      _id: { $oid: '612e50b7ef6f6f4676f9c7c5' },
      bird: 'Keltavästäräkki',
      rightImageAnswers: 1,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
  ],
  results: [
    {
      scores: [5, 9],
      _id: { $oid: '61174ce16769f33d4088662d' },
      level: '1',
      isImage: true,
    },
    {
      scores: [14, 2, 11, 2],
      _id: { $oid: '612bb118ae1c8510cdadc99a' },
      level: '2',
      isImage: true,
    },
    {
      scores: [9, 9],
      _id: { $oid: '612bbf280dfc3d001c981d5c' },
      level: '3',
      isImage: true,
    },
  ],
  __v: 30,
}

const body: ScoreBody = {
  userId: '234234',
  gameResult: { scores: [11], level: '3', isImage: true },
  knowledge: [
    {
      bird: 'Keltasirkku',
      rightImageAnswers: 2,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
    },
    {
      bird: 'Peltosirkku',
      rightImageAnswers: 3,
      rightAudioAnswers: 0,
      wrongImageAnswers: 0,
      wrongAudioAnswers: 0,
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
            <td className="text-center">{k.rightImageAnswers}</td>
          </tr>
        ))}
      </table>
    </Layout>
  )
}

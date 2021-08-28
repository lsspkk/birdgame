import levelsJson from './gamelevels.json'
const gameLevels = [...levelsJson]

import birdsJson from './birds.json'
const birds = [...birdsJson]

import { settings, Setting } from './settings'

export interface Bird {
  image: string
  name: string
  audio: string
  category: string
}

export interface Question {
  rightAnswer: number
  choises: string[]
}

interface GameLevels {
  name: string
  imageLevels: number[]
  audioLevels: number[]
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export function getRandomBirdName(): string {
  const index: number = Math.floor(Math.random() * birds.length)
  return birds[index].name
}

export function getBirds(level: number, isImageLevel: boolean): string[] {
  const birdNames: string[] = gameLevels
    .filter((b: GameLevels) =>
      isImageLevel
        ? b.imageLevels.includes(level)
        : b.audioLevels.includes(level),
    )
    .map((b) => b.name)
  shuffle(birdNames)
  return birdNames
}

export function getBird(name: string): Bird {
  const filtered = birds.filter((b: Bird) => b.name === name)
  if (filtered.length != 1) {
    throw new Error(`Bird ${name} not found`)
  }
  return filtered[0]
}

export function newLevel(
  level: number,
  isImageLevel: boolean,
  previousGame: Question[] | undefined,
): Question[] {
  const questions: Question[] = []

  if (previousGame !== undefined) {
    // TODO take last question of previous game, and use those to prevent asking same birds right away
  }
  const setting: Setting = settings.levels.filter((s) => s.level === level)[0]
  if (setting === undefined) {
    return questions
  }
  let gameBirds = getBirds(level, isImageLevel)

  if (setting.choises * 2 > gameBirds.length) {
    throw new Error(
      `Settings error: Level ${level} needs at least ${
        setting.choises * 2
      } birds, but only ${gameBirds.length} is configured.`,
    )
  }

  for (let i = 0; i < setting.questions; i++) {
    if ((1 + i) * setting.choises >= gameBirds.length) {
      // need more birds, use same
      // TODO check that added birds do not have same birds as previous question
      const moreBirds = getBirds(level, isImageLevel)
      const safeBirds = preventSameBirds(setting.choises, gameBirds, moreBirds)
      gameBirds = [...gameBirds, ...safeBirds]
    }

    const question: Question = {
      rightAnswer: Math.floor(Math.random() * setting.choises),
      choises: [],
    }
    for (let j = 0; j < setting.choises; j++) {
      const birdIndex = i * setting.choises + j
      question.choises.push(gameBirds[birdIndex])
    }
    questions.push(question)
  }
  return questions
}

function preventSameBirds(
  choises: number,
  gameBirds: string[],
  moreBirds: string[],
): string[] {
  const preventThese = gameBirds.slice(gameBirds.length - choises)
  const safeBirds = [...moreBirds]
  for (let i = 0; i < choises; i++) {
    if (preventThese.includes(safeBirds[i])) {
      // swap with another random bird that is ok
      let swapIndex = -1
      let count = 0

      while (swapIndex === -1 && ++count < 20) {
        const randomIndex =
          choises + Math.floor(Math.random() * (safeBirds.length - choises))
        if (!preventThese.includes(safeBirds[randomIndex])) {
          swapIndex = randomIndex
        }
      }
      if (swapIndex === -1) {
        console.log(
          'Unable to add birds to data, because there would be same birds: ',
          'birds in last question:',
          gameBirds,
          'next available birds:',
          safeBirds,
        )
        continue
      }
      const birdName = safeBirds[i]
      safeBirds[i] = safeBirds[swapIndex]
      safeBirds[swapIndex] = birdName
    }
    return safeBirds
  }
}

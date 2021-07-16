import levelsJson from './gamelevels.json'
const gameLevels = [...levelsJson]

import birdsJson from './birds.json'
const birds = [...birdsJson]


export interface Bird {
    image: string
    name: string
    audio: string
    category: string
}

export interface ImageLevel {
    level: number,
    oldLevels: ImageLevel[]
}

interface GameLevels {
    name: string
    imageLevels: number[]
    audioLevels: number[]
}

export function getImageBirds(level: number) {
    const birdNames: string[] = gameLevels.filter((b: GameLevels) => b.imageLevels.includes(level)).map(b => b.name)
    return birds.filter((b: Bird) => birdNames.includes(b.name))
}

export function getAudioBirds(level: number) {
    const birdNames: string[] = gameLevels.filter((b: GameLevels) => b.audioLevels.includes(level)).map(b => b.name)
    return birds.filter((b: Bird) => birdNames.includes(b.name))
}

export function getBird(name: string) {
    const filtered = birds.filter((b: Bird) => b.name === name)
    if (filtered.length != 1) {
        throw new Error(`Bird ${name} not found`)
    }
    return filtered[0]
}

export function newImageLevel(currentLevel: ImageLevel | undefined) {

    
}


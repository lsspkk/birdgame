import { getBird } from '../data/levels'
import { useSpeech } from './useSpeech'

export function ResultAnimation({
  animationSrc,
  animation,
  answerBirdName,
  url,
  rightBirdName,
  setAnimation,
}: {
  animationSrc: string
  animation: string
  answerBirdName: string
  url: string
  rightBirdName: string
  setAnimation: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  useSpeech(
    animation === 'right'
      ? congratulate(answerBirdName, rightBirdName)
      : encourage(answerBirdName, rightBirdName),
  )

  return (
    <>
      <img
        className="absolute top-0 left-0 w-full max-h-full"
        src={animationSrc}
        alt={animation}
        width="100%"
        height="auto"
      />
      {animation === 'right' && (
        <div className="absolute top-0 left-0 w-full h-full text-4xl text-center flex flex-col items-center justify-center m-4 text-green-800">
          <div>
            Oikein:
            <br />
            {answerBirdName}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xl mt-10 rounded"
            onClick={() => setTimeout(() => setAnimation(''), 100)}
          >
            Eteenpäin
          </button>
        </div>
      )}
      {animation === 'wrong' && (
        <div className="absolute top-0 left-0 w-full h-full text-xl text-center m-4 flex items-center flex-col justify-center text-red-900">
          <div>
            Vastasit väärin
            <div className="text-3xl">{answerBirdName}</div>
            <img
              className="my-2 mx-auto max-w-40 max-h-40 opacity-40"
              src={url + getBird(answerBirdName).image}
              alt={answerBirdName}
            />
          </div>

          <div className="mt-4">
            Oikea vastaus oli
            <div className="text-3xl">{rightBirdName}</div>
            <img
              className="my-2 mx-auto max-w-40 max-h-40 opacity-40"
              src={url + getBird(rightBirdName).image}
              alt={rightBirdName}
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xl mt-2 sm:mt-10 rounded"
            onClick={() => setTimeout(() => setAnimation(''), 100)}
          >
            Eteenpäin
          </button>
        </div>
      )}
    </>
  )
}
function congratulate(answerBirdName: string, rightBirdName: string): string {
  const choice = Math.random()

  if (choice < 0.5) {
    return `${answerBirdName} on oikein!`
  }
  if (choice < 0.75) {
    return `Mahtavaa ${answerBirdName} on oikea vastaus.`
  }
  if (choice < 0.8) {
    return `Upeaa, muistathan ikuisesti linnun ${answerBirdName}.`
  }
  if (choice < 0.85) {
    return `Sinäpäs osaat ${answerBirdName} on oikea vastaus.`
  }

  return `Hyvin arvattu ${answerBirdName} se on!`
}

function encourage(answerBirdName: string, rightBirdName: string): string {
  const choice = Math.random()
  if (choice < 0.33) {
    return `Väärin, ei ${answerBirdName} vaan ${rightBirdName}.`
  }
  if (choice < 0.5) {
    return `${answerBirdName} on väärä lintu. Oikea vastaus on ${rightBirdName}.`
  }
  if (choice < 0.66) {
    return `Ei ${answerBirdName}, vaan ${rightBirdName} on oikea vastaus.`
  }
  if (choice < 0.75) {
    return `Parempi onni ensi kerralla. Oikea vastaus on ${rightBirdName}.`
  }
  if (choice < 0.85) {
    return `Ei osunut tällä kertaa, oikea vastaus on ${rightBirdName}.`
  }
  return `Oikea vastaus olisi ollut ${rightBirdName}, eikä ${answerBirdName}.`
}

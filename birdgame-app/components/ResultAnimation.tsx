import { getBird } from '../data/levels'
import { useSpeech } from './useSpeech'
import { useIsPortrait } from './hooks/useIsPortrait'

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
      ? congratulate(answerBirdName)
      : encourage(answerBirdName, rightBirdName),
  )
  const isPortrait = useIsPortrait()

  return (
    <>
      {isPortrait && (
        <VerticalResult
          animationSrc={animationSrc}
          animation={animation}
          answerBirdName={answerBirdName}
          url={url}
          rightBirdName={rightBirdName}
          setAnimation={setAnimation}
        />
      )}
      {!isPortrait && (
        <HorizontalResult
          animationSrc={animationSrc}
          animation={animation}
          answerBirdName={answerBirdName}
          url={url}
          rightBirdName={rightBirdName}
          setAnimation={setAnimation}
        />
      )}
    </>
  )
}

function VerticalResult({
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
}) {
  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      {/* Topmost box: animation and result text */}
      <div className="flex flex-col items-center w-full mb-4">
        <img
          className="max-h-40 md:max-h-96"
          src={animationSrc}
          alt={animation}
        />
        <div
          className={`text-2xl font-bold mt-2 ${animation === 'right' ? 'text-green-800' : 'text-red-900'}`}
        >
          {animation === 'right' ? 'Vastasit oikein' : 'Vastasit väärin'}
        </div>
      </div>
      {/* Answered bird box */}
      <div className="flex flex-col items-center w-full mb-4">
        <div className="text-xl font-semibold">{answerBirdName}</div>
        <img
          className="my-2 mx-auto md:h-1/4 md:w-1/4 md:max-h-98 md:max-w-98"
          src={url + getBird(answerBirdName).image}
          alt={answerBirdName}
        />
      </div>
      {/* If wrong, show right answer box */}
      {animation === 'wrong' && (
        <div className="flex flex-col items-center w-full">
          <div className="text-lg">Oikea vastaus oli</div>
          <div className="text-xl font-semibold">{rightBirdName}</div>
          <img
            className="my-2 mx-auto md:h-1/4 md:w-1/4 md:max-h-98 md:max-w-98"
            src={url + getBird(rightBirdName).image}
            alt={rightBirdName}
          />
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xl mt-4 rounded"
        onClick={() => setTimeout(() => setAnimation(''), 100)}
      >
        Eteenpäin
      </button>
    </div>
  )
}

function HorizontalResult({
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
}) {
  return (
    <div className="flex flex-row items-end w-full h-full justify-end">
      {/* Left: Answered bird */}
      <div className="flex flex-col items-center flex-1">
        <div
          className={`text-2xl font-bold mt-2 ${animation === 'right' ? 'text-green-800' : 'text-red-900'}`}
        >
          {animation === 'right' ? 'Vastasit oikein' : 'Vastasit väärin'}
        </div>
        <div className="text-xl font-semibold">{answerBirdName}</div>
        <img
          className="my-2 mx-auto md:h-3/4 md:w-3/4 md:max-h-98 md:max-w-98"
          src={url + getBird(answerBirdName).image}
          alt={answerBirdName}
        />
      </div>
      {/* Center: Right answer if wrong */}
      {animation === 'wrong' && (
        <div className="flex flex-col items-center flex-1">
          <div className="text-lg">Oikea vastaus oli</div>
          <div className="text-xl font-semibold">{rightBirdName}</div>
          <img
            className="my-2 mx-auto md:h-3/4 md:w-3/4 md:max-h-98 md:max-w-98"
            src={url + getBird(rightBirdName).image}
            alt={rightBirdName}
          />
        </div>
      )}
      {/* Right: Animation and result text */}
      <div className="flex flex-col items-center justify-end flex-1">
        <img
          className="w-full max-h-40 w-auto"
          src={animationSrc}
          alt={animation}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xl mt-4 rounded"
          onClick={() => setTimeout(() => setAnimation(''), 100)}
        >
          Eteenpäin
        </button>
      </div>
    </div>
  )
}

function congratulate(answerBirdName: string): string {
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

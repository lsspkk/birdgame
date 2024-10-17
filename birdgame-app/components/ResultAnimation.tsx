import { getBird } from '../data/levels'

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

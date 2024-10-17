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
            onClick={() => setAnimation('')}
          >
            Eteenpäin
          </button>
        </div>
      )}
      {animation === 'wrong' && (
        <div className="absolute top-0 left-0 w-full h-full text-4xl text-center m-4 flex items-center flex-col justify-center text-red-900">
          <p>
            Vastasit väärin
            <br />
            {answerBirdName}
            <img
              className="my-2 mx-auto max-w-40 max-h-40 opacity-40"
              src={url + getBird(answerBirdName).image}
              alt={rightBirdName}
            />
          </p>

          <p className="mt-6">
            Oikea vastaus oli
            <br /> {rightBirdName}
            <img
              className="my-2 mx-auto max-w-40 max-h-40"
              src={url + getBird(rightBirdName).image}
              alt={rightBirdName}
            />
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xl mt-10 rounded"
            onClick={() => setAnimation('')}
          >
            Eteenpäin
          </button>
        </div>
      )}
    </>
  )
}

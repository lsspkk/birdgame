import React, { ReactNode, ReactElement, CSSProperties } from 'react'
import { settings, Setting } from '../data/settings'
import { ScoreInterface } from '../models/score'

const starTitles = [
  { stars: 0, name: '' },
  { stars: 1, name: 'Aloittelija' },
  { stars: 2, name: 'Opiskelija' },
  { stars: 3, name: 'Edistynyt' },
  { stars: 4, name: 'Tasokas' },
  { stars: 5, name: 'Tietäjä' },
  { stars: 6, name: 'Pikkunero' },
  { stars: 7, name: 'Guru' },
  { stars: 8, name: 'Bongari' },
  { stars: 9, name: 'Mestari' },
  { stars: 10, name: 'Suurvisiiri' },
]

export function useStars(
  score: ScoreInterface | undefined,
  level: number,
  resultType: 'image' | 'audio',
): ReactNode | undefined {
  let stars = 0
  if (score !== undefined) {
    const result = score.results.find((r) => {
      return parseInt(r.level) == level && r.resultType == resultType
    })
    if (result !== undefined) {
      stars = countStars(result.scores, level)
    }
  }
  return (
    <div
      className="flex align-center justify-center m-2"
      style={{
        marginRight: '-5px',
        width: '84px',
        borderRadius: '50%',
        background: stars !== 0 ? 'rgba(255,255,255, 0.5)' : '',
        boxShadow:
          stars !== 0
            ? '0 0 8px rgba(0, 100,0, 0.2), 0 0 2px rgba(0,0,0,0.7), 5px 5px 12px rgba(0,0,0,0.3)'
            : '',
      }}
    >
      <div>
        <StarCircle stars={stars} />
        <div
          style={{
            marginTop: '-51px',
            width: '84px',
            fontSize: '0.8em',
            textShadow: '0 0 2px #000000, 0 0 2px rgba(0, 0,0,0.5)',
          }}
          className="absolute text-center text-white font-bold"
        >
          {starTitles.find((s) => s.stars === stars)?.name}
        </div>
      </div>
    </div>
  )
}

export function countStars(scores: number[], level: number): number {
  const setting: Setting = settings.levels.filter((s) => s.level == level)[0]
  const starLimit = Math.floor(setting.questions * 0.7)
  return scores.filter((score) => score >= starLimit).length
}
export function isStarScore(score: number, questionAmount: number): boolean {
  const starLimit = Math.floor(questionAmount * 0.7)
  return score >= starLimit
}

export interface StarCircleProps {
  stars: number
}

export const StarCircle = ({ stars }: StarCircleProps): ReactElement => {
  const box = { display: 'block', width: '84px', height: '84px' }
  if (stars === 0) {
    return <div style={box}></div>
  }
  if (stars === 1) {
    return <Star scale={0.5} />
  }

  const circular = (total, i) => {
    const startAngle = total === 2 ? 0 : -90
    const degrees = (360 / total) * (i + 1) + startAngle
    const radius = Math.round(50 + 10 * total)
    return `rotate(${degrees}deg) translate(${radius}px) rotate(${-degrees}deg)`
  }

  return (
    <div style={box}>
      {new Array(stars).fill('').map((s, i) => (
        <Star
          key={`starkey${stars}${s}${i}`}
          scale={0.5 / (stars / Math.sqrt(stars * 1.5))}
          style={{ position: 'absolute', transform: circular(stars, i) }}
        />
      ))}
    </div>
  )
}

export function SpinningStar({
  shadow = false,
}: {
  shadow?: boolean
}): ReactElement {
  return (
    <div className="flex p-10 justify-center">
      <style jsx>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes colorize {
            100% {
              filter: hue-rotate(360deg);
            }
          }
          .spinningstar {
            animation: spin 5s linear infinite, colorize 2s linear infinite;
            ${shadow ? 'filter: grayscale(50%) blur(10px); opacity: 0.3;' : ''}
          }
        `}
      </style>
      <div className="spinningstar w-20 h-20">
        <Star scale={1.5} />
      </div>
    </div>
  )
}

function Star({
  scale,
  style,
}: {
  scale: number
  style?: CSSProperties
}): ReactElement {
  const tform = style?.transform !== undefined ? style?.transform + ' ' : ''
  return (
    <svg
      width="82"
      height="78"
      viewBox="0 0 82 78"
      style={{
        ...style,
        transform: `scale(${scale.toFixed(2)}) ${tform}`,
      }}
      fill="none"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M66.3263 77.995L40.9898 64.6671L15.6474 77.9852L20.4924 49.7681L-0.00392725 29.7794L28.327 25.668L41.0021 -0.00344689L53.6669 25.6734L81.9961 29.796L61.4924 49.7759L66.3263 77.995Z"
          fill="#FFCC00"
        />
        <path
          d="M53.7526 25.5099C40.9219 42.9775 40.7826 43.1675 40.7826 43.1675L81.9097 29.6985L53.7526 25.5099Z"
          fill="#FFE680"
        />
        <path
          d="M40.9937 42.7921V64.724L15.3956 77.8628L40.9937 42.7921Z"
          fill="#FFDD55"
        />
        <path
          d="M40.9937 42.7921L66.1624 77.1944L61.4384 49.3334L40.9937 42.7921Z"
          fill="#FFDD55"
        />
        <path
          d="M0.162552 29.7281L40.9958 42.793L28.3796 25.548L0.162552 29.7281Z"
          fill="#FFE680"
        />
        <path
          d="M40.9937 42.7921V0.0532227L53.588 25.5382L40.9937 42.7921Z"
          fill="#FFDD55"
        />
        <path
          d="M15.6573 77.5085L20.4118 49.4124L40.997 42.7921L15.6573 77.5085Z"
          fill="#FFD42A"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="82" height="78" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

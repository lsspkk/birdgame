import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { PlayIcon, SettingsIcon, TeamIcon } from '../components/Icons'
import { Layout } from '../components/Layout'
import { UserSelectionController } from '../components/UserSelection'

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <Layout>
      <style jsx>
        {`
          @keyframes spinit {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes flyit {
            0% {
              display: block;
              transform: translateX(0%) translateY(0vh) rotateZ(0deg);
            }

            15% {
              transform: translateX(2%) translateY(-5vh) rotateZ(90deg);
            }

            30% {
              transform: translateX(4%) translateY(-10vh) rotateZ(180deg);
            }

            45% {
              transform: translateX(2%) translateY(-5vh) rotateZ(270deg);
            }

            60% {
              transform: translateX(0%) translateY(0) rotateZ(360deg);
            }

            75% {
              transform: translateX(-2%) translateY(4vh) rotateZ(270deg);
            }

            85% {
              transform: translateX(-4%) translateY(8vh) rotateZ(180deg);
            }

            100% {
              transform: translateX(0%) translateY(0vh) rotateZ(00deg);
            }
          }

          .flyfly {
            animation: flyit 7s linear infinite;
          }
          .spinspin {
            object-fit: cover;
            animation:
              spinit 30s linear infinite,
              flyit 5s linear infinite;
            height: 100%;
            width: 100%;
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-between h-full flex-grow">
        <UserSelectionController />

        <div className="flex w-full justify-center">
          <div className="flex flex-col items-center spinspin flyfly">
            <PlayIcon
              className="h-20 w-40"
              onClick={() => router.push('/gametype')}
            />
            Pelaa
          </div>
        </div>
        <div className="flex w-full gap-8 justify-center opacity-70 text-sm">
          <div className="flex flex-col items-center ">
            <SettingsIcon
              className="h-10 w-10"
              onClick={() => router.push('/settings')}
            />
            <div>Asetukset</div>
          </div>
          <div className="flex-col items-center flex">
            <TeamIcon
              className="h-10 w-20 "
              onClick={() => router.push('/team')}
            />
            <div>Joukkue/pelaaja</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

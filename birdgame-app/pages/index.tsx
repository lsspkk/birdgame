import React from 'react'
import { BirdIcon, BirdIconNoSound } from '../components/Icons'
import { Layout } from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <h1 className="text-6xl font-bold">
        <BirdIcon /> Lintupeli
      </h1>

      <p className="mt-3 text-2xl">Valitse tehtävä</p>

      <div className="flex justify-center text-center">
        <div className="w-1/3 bg-red-200 p-4">
          <Link href="/imagelevel/1">
            <div>
              <BirdIconNoSound />1
            </div>
          </Link>
        </div>
        <div className="w-1/3 bg-red-300 p-4">
          <Link href="/imagelevel/2">
            <div>
              <BirdIconNoSound />2
            </div>
          </Link>
        </div>
        <div className="w-1/3 bg-red-400 p-4">
          <Link href="/imagelevel/3">
            <div>
              <BirdIconNoSound />3
            </div>
          </Link>
        </div>
        <div className="w-1/3 bg-red-500 p-4">
          <Link href="/imagelevel/4">
            <div>
              <BirdIconNoSound />4
            </div>
          </Link>
        </div>
        <div className="w-1/3 bg-red-700 p-4">
          <Link href="/imagelevel/5">
            <div>
              <BirdIconNoSound />5
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

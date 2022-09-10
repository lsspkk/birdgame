import React, {
  ChangeEvent,
  HTMLAttributes,
  ReactElement,
  useContext,
  useState,
} from 'react'
import { Layout } from '../components/Layout'
import { Button } from '../components/basic/Button'
import {
  GameContext,
  getTextColor,
  SettingColor,
  Settings,
} from '../components/state'
import { useRouter } from 'next/dist/client/router'

export default function Home(): ReactElement {
  const router = useRouter()
  const { settings, setSettings } = useContext(GameContext)
  const [state, setState] = useState<Settings>({ ...settings })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'sound') {
      setState({ ...state, sound: e.target.checked })
    }
    if (e.target.name === 'delay') {
      setState({ ...state, delay: Number(e.target.value) })
    }
    if (e.target.name === 'color') {
      setState({ ...state, color: e.target.value as SettingColor })
    }
  }

  function handleSave() {
    localStorage.setItem('settings', JSON.stringify(state))
    setSettings({ ...state })
    router.back()
  }
  return (
    <Layout>
      <div className="ml-4">
        <Title>Asetukset</Title>
        <Title className="mt-8">Välianimaatio</Title>
        <div className="ml-4">
          <div className="flex">
            <input
              id="sound"
              type="checkbox"
              name="sound"
              checked={state.sound}
              onChange={handleChange}
            />
            <label className="ml-1" htmlFor="sound">
              Soita ääniefekti
            </label>
          </div>
          <div className="flex mt-4">
            <input
              id="short"
              type="radio"
              name="delay"
              value="700"
              onChange={handleChange}
              checked={state.delay === 700}
            />
            <label className="ml-1" htmlFor="short">
              Lyhyt
            </label>
          </div>
          <div className="flex">
            <input
              id="quick"
              type="radio"
              name="delay"
              value="1200"
              checked={state.delay === 1200}
              onChange={handleChange}
            />
            <label className="ml-1" htmlFor="quick">
              Lyhyehkö
            </label>
          </div>
          <div className="flex">
            <input
              id="normal"
              type="radio"
              name="delay"
              value="3000"
              checked={state.delay === 3000}
              onChange={handleChange}
            />
            <label className="ml-1" htmlFor="normal">
              Tavallinen
            </label>
          </div>

          <div className="flex">
            <input
              id="long"
              type="radio"
              name="delay"
              value="5000"
              checked={state.delay === 5000}
              onChange={handleChange}
            />
            <label className="ml-1" htmlFor="long">
              Pitkä
            </label>
          </div>
        </div>

        <Title className="mt-8">Värit</Title>
        <div className="flex ml-4">
          <input
            id="gray"
            type="radio"
            name="color"
            value="gray"
            onChange={handleChange}
            checked={state.color === 'gray'}
          />
          <div className={getTextColor('gray')}>
            <label className="ml-1" htmlFor="gray">
              Harmaa
            </label>
          </div>
        </div>
        <div className="flex ml-4">
          <input
            id="red"
            type="radio"
            name="color"
            value="red"
            checked={state.color === 'red'}
            onChange={handleChange}
          />
          <div className={getTextColor('red')}>
            <label className="ml-1" htmlFor="red">
              Punainen
            </label>
          </div>
        </div>
        <div className="flex ml-4">
          <input
            id="blue"
            type="radio"
            name="color"
            value="blue"
            checked={state.color === 'blue'}
            onChange={handleChange}
          />
          <div className={getTextColor('blue')}>
            <label className="ml-1" htmlFor="blue">
              Sininen
            </label>
          </div>
        </div>

        <div>
          <Button onClick={handleSave} className="mt-8">
            Tallenna
          </Button>
        </div>
      </div>
    </Layout>
  )
}

function Title(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex justify-between items-center align-content-center text-2xl font-bold my-2 ${
        props.className ?? props.className
      }`}
    >
      {props?.children}
    </div>
  )
}

function SubTitle(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex justify-between items-center align-content-center text-xl font-bold ${
        props.className ?? props.className
      }`}
    >
      {props?.children}
    </div>
  )
}

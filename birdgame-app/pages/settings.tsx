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
  Language,
} from '../components/state'
import { useRouter } from 'next/dist/client/router'
import { speak } from '../components/useSpeech'

function InputWithLabel({
  name,
  type,
  checked,
  onChange,
  label,
  value,
  ...props
}: {
  value?: string
  name: string
  type: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label: string
} & HTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex">
      <input
        id={name + value || ''}
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <label className="ml-1" htmlFor={name + value || ''}>
        {label}
      </label>
    </div>
  )
}

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
    if (e.target.name === 'speech') {
      setState({ ...state, speech: e.target.checked })
    }
    let lang = state.language
    if (e.target.name === 'language') {
      lang = e.target.value as Language
      setState({ ...state, language: lang })
    }
    if (
      (e.target.name === 'speech' && e.target.checked) ||
      (e.target.name === 'language' && state.speech)
    ) {
      speak(
        'Kuinka hyvin tunnet linnut, kysyy ' + getNationality(lang) + '?',
        state.language,
      )
    }
  }

  function handleSave() {
    localStorage.setItem('settings', JSON.stringify(state))
    setSettings({ ...state })
    router.back()
  }

  const language = state.language || 'fr'

  return (
    <Layout>
      <div className="ml-4">
        <Title>Asetukset</Title>
        <Title className="mt-8">Välianimaatio</Title>
        <div className="ml-4">
          <InputWithLabel
            name="sound"
            type="checkbox"
            checked={state.sound}
            onChange={handleChange}
            label="Soita ääniefekti"
          />
          <div className="pt-2"></div>
          <InputWithLabel
            name="delay"
            type="radio"
            value="700"
            onChange={handleChange}
            checked={state.delay === 700}
            label="Lyhyt"
          />
          <InputWithLabel
            name="delay"
            type="radio"
            value="1200"
            checked={state.delay === 1200}
            onChange={handleChange}
            label="Lyhyehkö"
          />
          <InputWithLabel
            name="delay"
            type="radio"
            value="3000"
            checked={state.delay === 3000}
            onChange={handleChange}
            label="Tavallinen"
          />
          <InputWithLabel
            name="delay"
            type="radio"
            value="5000"
            checked={state.delay === 5000}
            onChange={handleChange}
            label="Pitkä"
          />
        </div>

        <Title className="mt-8">Värit</Title>
        <div className="flex ml-4 flex-col gap-1">
          <div className={getTextColor('gray')}>
            <InputWithLabel
              name="color"
              type="radio"
              value="gray"
              checked={state.color === 'gray'}
              onChange={handleChange}
              label="Harmaa"
            />
          </div>
          <div className={getTextColor('red')}>
            <InputWithLabel
              name="color"
              type="radio"
              value="red"
              checked={state.color === 'red'}
              onChange={handleChange}
              label="Punainen"
            />
          </div>
          <div className={getTextColor('blue')}>
            <InputWithLabel
              name="color"
              type="radio"
              value="blue"
              checked={state.color === 'blue'}
              onChange={handleChange}
              label="Sininen"
            />
          </div>
        </div>

        <Title className="mt-8">Puhe</Title>
        <div className="ml-4">
          <InputWithLabel
            name="speech"
            type="checkbox"
            checked={state.speech}
            onChange={handleChange}
            label="Puhu lintujen nimet"
          />
          <div className="pt-2"></div>
          <InputWithLabel
            name="language"
            type="radio"
            value="en"
            onChange={handleChange}
            checked={language === 'en'}
            label="Englantilainen"
          />
          <InputWithLabel
            name="language"
            type="radio"
            value="fr"
            onChange={handleChange}
            checked={language === 'fr'}
            label="Ranskalainen"
          />
          <InputWithLabel
            name="language"
            type="radio"
            value="sv"
            onChange={handleChange}
            checked={language === 'sv'}
            label="Ruotsalainen"
          />
          <InputWithLabel
            name="language"
            type="radio"
            value="es"
            onChange={handleChange}
            checked={language === 'es'}
            label="Espanjalainen"
          />
          <InputWithLabel
            name="language"
            type="radio"
            value="cs"
            onChange={handleChange}
            checked={language === 'cs'}
            label="Tšekkiläinen"
          />
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
function getNationality(lang: Language) {
  switch (lang) {
    case 'en':
      return 'englantilainen'
    case 'fr':
      return 'ranskalainen'
    case 'sv':
      return 'ruotsalainen'
    case 'es':
      return 'espanjalainen'
    case 'cs':
      return 'tšekkiläinen'
  }
  return ''
}

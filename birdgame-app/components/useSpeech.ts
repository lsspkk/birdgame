import { useContext, useEffect } from 'react'
import { GameContext } from './state'

export function speak(message: string, language: string) {
  if (!window) return
  const synth = window.speechSynthesis
  const voices = synth.getVoices()
  const utterThis = new SpeechSynthesisUtterance(message)
  utterThis.voice = voices.find((v) => v.lang.includes(language))
  synth.speak(utterThis)
  return synth
}

export function useSpeech(message: string): void {
  const { settings } = useContext(GameContext)

  useEffect(() => {
    if (!settings.speech) return
    const synth = speak(message, settings.language)

    return () => synth.cancel()
  }, [message, settings.language, settings.speech])
}

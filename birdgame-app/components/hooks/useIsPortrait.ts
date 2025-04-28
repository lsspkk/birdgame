import { useEffect, useState } from 'react'

export function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth < window.innerHeight
      : true,
  )

  useEffect(() => {
    const handleResize = () =>
      setIsPortrait(window.innerWidth < window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isPortrait
}

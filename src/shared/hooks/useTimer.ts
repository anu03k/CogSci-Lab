import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimer(initialSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (remaining <= 0) {
      if (!firedRef.current) {
        firedRef.current = true
        onExpireRef.current()
      }
      return
    }
    const id = window.setTimeout(() => setRemaining((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining])

  const reset = useCallback(() => {
    firedRef.current = false
    setRemaining(initialSeconds)
  }, [initialSeconds])

  return { remaining, reset }
}

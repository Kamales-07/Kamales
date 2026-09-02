import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'date-invite:'

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * useState that survives a refresh. Falls back to plain state whenever
 * storage is unavailable (private windows, blocked site data).
 */
export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback))

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* storage unavailable — keep running in memory */
    }
  }, [key, value])

  return [value, setValue]
}

export function useClearPersistedState() {
  return useCallback(() => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => window.localStorage.removeItem(k))
    } catch {
      /* nothing to clear */
    }
  }, [])
}

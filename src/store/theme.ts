import { create } from 'zustand'

export type Theme = 'light' | 'dark'

/* Same localStorage key as legacy scripts-theme.js so theme
   persists seamlessly between the React SPA and legacy MPA pages. */
const KEY = 'vent-theme'

function readTheme(): Theme {
  const saved = localStorage.getItem(KEY)
  return saved === 'dark' ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
  set: (t: Theme) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readTheme(),
  set: (t) => {
    localStorage.setItem(KEY, t)
    document.documentElement.setAttribute('data-theme', t)
    set({ theme: t })
  },
  toggle: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    get().set(next)
  },
}))

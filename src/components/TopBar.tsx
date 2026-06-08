import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useThemeStore } from '../store/theme'

interface TopBarProps {
  onHamburger: () => void
  hamActive: boolean
}

export function TopBar({ onHamburger, hamActive }: TopBarProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const now = new Date()
      setClock(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header id="icu-topbar">
      <button
        className={'tb-ham' + (hamActive ? ' is-active' : '')}
        aria-label="Toggle menu"
        onClick={onHamburger}
      >
        <span></span><span></span><span></span>
      </button>
      <Link className="tb-brand" to="/">
        <div className="brand-dot"></div>
        ICU_HELPER
      </Link>
      <div className="tb-right">
        <div className="tb-clock">{clock}</div>
        <div className="toggle-wrap">
          <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          <label className="toggle-switch" title="Toggle Light/Dark">
            <input type="checkbox" checked={theme === 'dark'} onChange={toggle} />
            <div className="toggle-track"><div className="toggle-knob"></div></div>
          </label>
        </div>
      </div>
    </header>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { BOTTOM_NAV } from '../lib/navData'
import { Icon } from './Icon'

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav id="icu-bottom-nav" aria-label="Navigasi utama">
      {BOTTOM_NAV.map((item) => {
        const active = !!item.to && item.to === pathname
        const cls = 'bn-item' + (active ? ' active' : '')
        const inner = (
          <>
            <Icon name={item.icon} className="bn-icon" />
            <span className="bn-label">{item.label}</span>
          </>
        )
        return item.to ? (
          <Link key={item.id} className={cls} to={item.to}>{inner}</Link>
        ) : (
          <a key={item.id} className={cls} href={item.href}>{inner}</a>
        )
      })}
    </nav>
  )
}

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PAGES, type NavItem, type NavSub } from '../lib/navData'
import { Icon } from './Icon'

/* Renders a link that is internal (React Router <Link to>) when the target
   is migrated, or an external <a href> to a legacy MPA page otherwise. */
function NavLink({
  to, href, className, onNavigate, children,
}: {
  to?: string
  href?: string
  className: string
  onNavigate: () => void
  children: React.ReactNode
}) {
  if (to) {
    return <Link className={className} to={to} onClick={onNavigate}>{children}</Link>
  }
  return <a className={className} href={href} onClick={onNavigate}>{children}</a>
}

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.to) return item.to === pathname
  return item.subs.some((s) => s.to && s.to === pathname)
}

function isSubActive(sub: NavSub, pathname: string): boolean {
  return !!sub.to && sub.to === pathname
}

export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { pathname } = useLocation()
  // Track which accordion sections are manually open; default-open the active one.
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <aside id="icu-sidebar">
      <nav className="sb-nav">
        {PAGES.map((p) => {
          const active = isItemActive(p, pathname)
          const hasSubs = p.subs.length > 0
          const open = openIds[p.id] ?? active

          if (!hasSubs) {
            return (
              <div className="sb-item" key={p.id}>
                <NavLink
                  to={p.to}
                  href={p.href}
                  className={'sb-link' + (active ? ' active' : '')}
                  onNavigate={onNavigate}
                >
                  <Icon name={p.icon} className="sb-icon" />
                  <span className="sb-label">{p.label}</span>
                </NavLink>
              </div>
            )
          }

          return (
            <div className={'sb-item has-subs' + (open ? ' open' : '')} key={p.id}>
              <div className="sb-link-row">
                <NavLink
                  to={p.to}
                  href={p.href}
                  className={'sb-link sb-main-link' + (active ? ' active' : '')}
                  onNavigate={onNavigate}
                >
                  <Icon name={p.icon} className="sb-icon" />
                  <span className="sb-label">{p.label}</span>
                </NavLink>
                <button
                  className="sb-chev-btn"
                  aria-label="Buka submenu"
                  onClick={() => toggleOpen(p.id)}
                >
                  <span className="sb-chev"></span>
                </button>
              </div>
              <div className="sb-subs">
                {p.subs.map((sub) => (
                  <NavLink
                    key={sub.label}
                    to={sub.to}
                    href={sub.href}
                    className={'sb-sub-link' + (isSubActive(sub, pathname) ? ' active' : '')}
                    onNavigate={onNavigate}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

function isMobile() {
  return window.innerWidth < 769
}

export function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  // Apply the legacy layout body class so existing CSS padding/grid applies.
  useEffect(() => {
    document.body.classList.add('has-sidebar')
    return () => {
      document.body.classList.remove('has-sidebar', 'sb-open', 'sb-collapsed')
    }
  }, [])

  // Sync body classes with drawer/collapse state.
  useEffect(() => {
    document.body.classList.toggle('sb-open', mobileOpen)
  }, [mobileOpen])

  useEffect(() => {
    document.body.classList.toggle('sb-collapsed', collapsed)
  }, [collapsed])

  // Close the mobile drawer and scroll to top whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0 })
  }, [pathname])

  // Close drawer if resized up to desktop.
  useEffect(() => {
    const onResize = () => {
      if (!isMobile()) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onHamburger = useCallback(() => {
    if (isMobile()) {
      setMobileOpen((v) => !v)
    } else {
      setCollapsed((v) => !v)
    }
  }, [])

  const closeDrawer = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <TopBar onHamburger={onHamburger} hamActive={mobileOpen || collapsed} />
      <Sidebar onNavigate={closeDrawer} />
      <div
        id="icu-overlay"
        style={{ display: mobileOpen ? 'block' : 'none' }}
        onClick={closeDrawer}
      />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

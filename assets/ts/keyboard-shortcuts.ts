// keyboard-shortcuts.ts — global keyboard shortcut manager for ICU Helper calculator pages

'use strict'

interface Shortcut {
  key: string        // e.g. 'Enter', 'r', 'p'
  ctrl?: boolean
  description: string
  action: () => void
}

type PageType = 'abg' | 'ibw' | 'sofa' | 'pf' | 'renal'

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const _registered: Array<{ shortcut: Shortcut; handler: (e: KeyboardEvent) => void }> = []

// ---------------------------------------------------------------------------
// 1. registerShortcuts
// ---------------------------------------------------------------------------

export function registerShortcuts(shortcuts: Shortcut[]): void {
  for (const shortcut of shortcuts) {
    const handler = (e: KeyboardEvent) => {
      const ctrlRequired = shortcut.ctrl === true
      const ctrlPressed = e.ctrlKey || e.metaKey
      if (ctrlRequired !== ctrlPressed) return
      if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return
      shortcut.action()
    }
    document.addEventListener('keydown', handler)
    _registered.push({ shortcut, handler })
  }
}

// ---------------------------------------------------------------------------
// 2. registerPageShortcuts
// ---------------------------------------------------------------------------

function _capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function registerPageShortcuts(pageType: PageType): void {
  const page = _capitalize(pageType) // e.g. 'Abg', 'Ibw'

  const shortcuts: Shortcut[] = [
    {
      key: 'Enter',
      ctrl: true,
      description: 'Hitung / kalkulasi',
      action: () => {
        const fn = (window as unknown as Record<string, unknown>)[`calc${page}`]
        if (typeof fn === 'function') {
          (fn as () => void)()
        }
      },
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Reset form',
      action: () => {
        const fn = (window as unknown as Record<string, unknown>)[`reset${page}`]
        if (typeof fn === 'function') {
          (fn as () => void)()
        }
      },
    },
    {
      key: 'Escape',
      ctrl: false,
      description: 'Tutup modal/panel',
      action: () => {
        // Close any open modal or panel — look for common patterns
        const modal = document.querySelector<HTMLElement>(
          '.modal[style*="display: block"], .modal.open, .modal.active, [data-modal].open'
        )
        if (modal) {
          modal.style.display = 'none'
          modal.classList.remove('open', 'active')
        }
        // Also try calling a global close function if present
        const closeFn = (window as unknown as Record<string, unknown>)['closeModal']
        if (typeof closeFn === 'function') {
          (closeFn as () => void)()
        }
      },
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Cetak / export',
      action: () => {
        const fn = (window as unknown as Record<string, unknown>)[`print${page}`]
        if (typeof fn === 'function') {
          (fn as () => void)()
        } else {
          window.print()
        }
      },
    },
  ]

  // Ctrl+R handler must prevent default to stop browser refresh
  const ctrlRHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
      e.preventDefault()
    }
  }
  document.addEventListener('keydown', ctrlRHandler)
  // Store as synthetic entry so unregisterAll can clean it up
  _registered.push({
    shortcut: { key: 'r', ctrl: true, description: '_preventDefault', action: () => undefined },
    handler: ctrlRHandler,
  })

  // Ctrl+P handler must prevent default to stop browser print dialog before our handler
  const ctrlPHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault()
    }
  }
  document.addEventListener('keydown', ctrlPHandler)
  _registered.push({
    shortcut: { key: 'p', ctrl: true, description: '_preventDefault', action: () => undefined },
    handler: ctrlPHandler,
  })

  registerShortcuts(shortcuts)
}

// ---------------------------------------------------------------------------
// 3. showShortcutHint
// ---------------------------------------------------------------------------

export function showShortcutHint(): void {
  const SESSION_KEY = 'icu-shortcut-hint-shown'
  if (sessionStorage.getItem(SESSION_KEY)) return
  sessionStorage.setItem(SESSION_KEY, '1')

  const hint = document.createElement('div')
  hint.textContent = '⌨ Ctrl+Enter = Hitung · Ctrl+R = Reset · Ctrl+P = Cetak'
  hint.style.cssText = [
    'position:fixed',
    'bottom:16px',
    'right:16px',
    'background:rgba(0,0,0,0.7)',
    'color:#fff',
    'font-size:11px',
    'border-radius:8px',
    'padding:6px 10px',
    'z-index:999',
    'pointer-events:none',
    'transition:opacity 0.6s ease',
    'opacity:1',
  ].join(';')

  document.body.appendChild(hint)

  // Fade out after 3 seconds
  setTimeout(() => {
    hint.style.opacity = '0'
    hint.addEventListener('transitionend', () => hint.remove(), { once: true })
  }, 3000)
}

// ---------------------------------------------------------------------------
// 4. unregisterAll
// ---------------------------------------------------------------------------

export function unregisterAll(): void {
  for (const { handler } of _registered) {
    document.removeEventListener('keydown', handler)
  }
  _registered.length = 0
}

// ---------------------------------------------------------------------------
// Expose to window
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    registerPageShortcuts: typeof registerPageShortcuts
  }
}

window.registerPageShortcuts = registerPageShortcuts

import { Link } from 'react-router-dom'
import { PAGES } from '../lib/navData'
import { Icon } from '../components/Icon'

export function Home() {
  const cards = PAGES.filter((p) => p.id !== 'index')

  return (
    <>
      <div className="home-hero">
        <h1 style={{ margin: '4px 0 2px' }}>ICU Helper</h1>
        <p className="subtitle" style={{ marginTop: 0 }}>
          Panduan Klinis Lengkap · Referensi Lokal &amp; Internasional · v2.0 — 2026
        </p>
        <p className="home-badge-line">
          <span className="hc-badge">React</span> Versi baru sedang dimigrasi bertahap.
          Halaman bertanda <span className="hc-badge">Baru</span> sudah berjalan di React.
        </p>
      </div>

      <div className="home-grid">
        {cards.map((p) => {
          // A section counts as "migrated" if it or any sub has an internal route.
          const migrated = !!p.to || p.subs.some((s) => s.to)
          const target = p.to ?? p.subs.find((s) => s.to)?.to
          const inner = (
            <>
              <Icon name={p.icon} size={22} className="hc-icon" />
              <span className="hc-label">{p.label}</span>
              <span className="hc-sub">{p.subtitle}</span>
              {migrated && <span className="hc-badge hc-badge-new">Baru</span>}
            </>
          )
          return migrated && target ? (
            <Link key={p.id} className="home-card" to={target}>{inner}</Link>
          ) : (
            <a key={p.id} className="home-card" href={p.href}>{inner}</a>
          )
        })}
      </div>
    </>
  )
}

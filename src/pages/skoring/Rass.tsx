import { useState } from 'react'
import { rassInterp, RASS_OPTIONS } from '../../lib/skoring'

export function Rass() {
  const [score, setScore] = useState<number | null>(null)
  const res = score != null ? rassInterp(score) : null

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>RASS — Sedasi Agitasi</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Richmond Agitation-Sedation Scale · Target PADIS: 0 atau −1</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {RASS_OPTIONS.map(o => (
          <label key={o.score} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 8, cursor: 'pointer',
            background: score === o.score ? 'var(--accent-subtle, var(--teal-bg))' : 'var(--surface2, var(--bg))',
            border: score === o.score ? '1.5px solid var(--accent, var(--teal))' : '1px solid var(--border)',
          }}>
            <input type="radio" name="rass" value={o.score} checked={score === o.score} onChange={() => setScore(o.score)} style={{ accentColor: 'var(--accent, var(--teal))' }} />
            <span style={{ minWidth: 28, fontWeight: 700 }}>{o.score > 0 ? '+' : ''}{o.score}</span>
            <span style={{ fontWeight: 600 }}>{o.name}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>{o.desc}</span>
          </label>
        ))}
      </div>

      {res && (
        <div className="result-card" style={{ marginTop: 16, borderLeft: `4px solid var(--${res.color})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: `var(--${res.color})` }}>{res.score > 0 ? '+' : ''}{res.score}</div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>RASS Score</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: `var(--${res.color})` }}>{res.title}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', background: 'var(--surface2, var(--bg))', borderRadius: 8, padding: 12 }}>
            {res.action}
          </div>
        </div>
      )}
    </div>
  )
}

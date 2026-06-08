import { useState } from 'react'
import { computeCandida, type CandidaInput } from '../../lib/skoring'

const DEF: CandidaInput = { surgery: false, tpn: false, colonize: false, sepsis: false }

export function Candida() {
  const [f, setF] = useState<CandidaInput>(DEF)
  const [res, setRes] = useState<ReturnType<typeof computeCandida> | null>(null)

  const toggle = (k: keyof CandidaInput) => setF(p => ({ ...p, [k]: !p[k] }))

  const ITEMS = [
    { k: 'surgery' as const, label: 'Operasi Mayor', sub: '(sebelum atau selama ICU stay)', pts: '+1' },
    { k: 'tpn' as const, label: 'Total Parenteral Nutrition (TPN)', sub: '', pts: '+1' },
    { k: 'colonize' as const, label: 'Kolonisasi Candida Multifocal', sub: '(≥2 tempat non-steril)', pts: '+1' },
    { k: 'sepsis' as const, label: 'Sepsis Berat', sub: '(disfungsi organ akut)', pts: '+2' },
  ]

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>Candida Score</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Risiko Invasive Candidiasis di ICU · León 2006 · Cut-off ≥3</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ITEMS.map(item => (
          <label key={item.k} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
            borderRadius: 8, cursor: 'pointer',
            background: f[item.k] ? 'var(--red-bg, #fff5f5)' : 'var(--surface2, var(--bg))',
            border: `1.5px solid ${f[item.k] ? 'var(--red)' : 'var(--border)'}`,
          }}>
            <input type="checkbox" checked={f[item.k]} onChange={() => toggle(item.k)} style={{ accentColor: 'var(--red)', width: 16, height: 16 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600 }}>{item.label}</span>
              {item.sub && <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>{item.sub}</span>}
            </div>
            <span style={{ fontWeight: 700, color: f[item.k] ? 'var(--red)' : 'var(--muted)', minWidth: 24, textAlign: 'right' }}>{item.pts}</span>
          </label>
        ))}
      </div>

      <button className="btn-calc" onClick={() => setRes(computeCandida(f))}>Hitung Candida Score</button>

      {res && (
        <div className="result-card" style={{ marginTop: 16, borderLeft: `4px solid var(--${res.color})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: `var(--${res.color})` }}>{res.score}</div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>Candida Score</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: `var(--${res.color})` }}>{res.interp}</div>
            </div>
          </div>
          {res.items.length > 0 && (
            <ul style={{ margin: '0 0 10px 0', paddingLeft: 20, fontSize: 13 }}>
              {res.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}
          <div style={{ fontSize: 13, background: res.high ? 'var(--red-bg, #fff5f5)' : 'var(--green-bg, #f0fff4)', borderRadius: 8, padding: 12, lineHeight: 1.6 }}>
            {res.action}
          </div>
        </div>
      )}
    </div>
  )
}

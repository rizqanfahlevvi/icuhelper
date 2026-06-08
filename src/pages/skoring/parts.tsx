import type { ReactNode } from 'react'
import type { ScoreRow } from '../../lib/skoring'

export function ScoreHeader({
  total, label, interp, detail, color, children,
}: {
  total: ReactNode
  label: string
  interp: string
  detail?: string
  color: string
  children?: ReactNode
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: 14,
      background: `var(--${color}-bg, var(--bg))`, border: `.5px solid var(--${color})`,
      borderRadius: 10, marginBottom: 12, flexWrap: 'wrap',
    }}>
      <div className="big-total" style={{ color: `var(--${color})` }}>{total}</div>
      <div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: `var(--${color})` }}>{interp}</div>
        {detail && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{detail}</div>}
        {children}
      </div>
    </div>
  )
}

export function SkoRows({ rows }: { rows: ScoreRow[] }) {
  return (
    <>
      {rows.map((r, i) => r.pts == null ? (
        <div key={i} className="sko-row row-skip">
          <div className="sp"><strong>{r.organ}</strong><small>Tidak tersedia — tidak dihitung</small></div>
          <div className="spts" style={{ color: 'var(--muted)' }}>—</div>
        </div>
      ) : (
        <div key={i} className="sko-row">
          <div className="sp"><strong>{r.organ}</strong><small>{r.detail}</small></div>
          <div className={`spts spts-${Math.min(r.pts, 4)}`}>{r.pts}</div>
        </div>
      ))}
    </>
  )
}

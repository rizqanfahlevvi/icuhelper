import { useNavigate, useParams } from 'react-router-dom'
import { Sofa } from './skoring/Sofa'
import { Rass } from './skoring/Rass'
import { CamIcu } from './skoring/CamIcu'
import { Apache } from './skoring/Apache'
import { Cpis } from './skoring/Cpis'
import { Cfs } from './skoring/Cfs'
import { Candida } from './skoring/Candida'

const TABS = [
  { id: 'sofa', label: 'SOFA', component: Sofa },
  { id: 'apache', label: 'APACHE-II', component: Apache },
  { id: 'rass', label: 'RASS', component: Rass },
  { id: 'camicu', label: 'CAM-ICU', component: CamIcu },
  { id: 'cpis', label: 'CPIS', component: Cpis },
  { id: 'cfs', label: 'Frailty', component: Cfs },
  { id: 'candida', label: 'Candida', component: Candida },
]

export function Skoring() {
  const { sub } = useParams<{ sub?: string }>()
  const navigate = useNavigate()
  const activeId = sub ?? TABS[0].id
  const active = TABS.find(t => t.id === activeId) ?? TABS[0]
  const Comp = active.component

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px' }}>Skoring ICU</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>SOFA · APACHE-II · RASS · CAM-ICU · CPIS · Frailty · Candida</p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(`/skoring/${t.id}`)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: active.id === t.id ? 'var(--accent, var(--teal))' : 'var(--surface2, var(--bg))',
            color: active.id === t.id ? '#fff' : 'var(--text)',
            border: `1.5px solid ${active.id === t.id ? 'var(--accent, var(--teal))' : 'var(--border)'}`,
          }}>{t.label}</button>
        ))}
      </div>

      <Comp />
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { Impending } from './teori/Impending'
import { Fisiologi } from './teori/Fisiologi'
import { GagalNapas } from './teori/GagalNapas'
import { Sepsis } from './teori/Sepsis'
import { B1B6 } from './teori/B1B6'
import { Airway } from './teori/Airway'
import { SatSbtVap } from './teori/SatSbtVap'

const TABS = [
  { id: 'impending', label: '⚠️ Impending' },
  { id: 'fisiologi', label: '🔬 Fisiologi' },
  { id: 'gagal-napas', label: '🫁 Gagal Napas' },
  { id: 'sepsis', label: '🦠 Sepsis' },
  { id: 'b1b6', label: '📋 B1–B6' },
  { id: 'airway', label: '🩺 Airway' },
  { id: 'sat-sbt-vap', label: '🔄 SAT/SBT/VAP' },
]

export function Teori() {
  const { sub } = useParams<{ sub?: string }>()
  const navigate = useNavigate()
  const active = sub || 'impending'

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-200">
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(`/teori/${t.id}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              active === t.id
                ? 'bg-teal-600 text-white'
                : 'text-slate-500 hover:bg-slate-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {active === 'impending' && <Impending />}
      {active === 'fisiologi' && <Fisiologi />}
      {active === 'gagal-napas' && <GagalNapas />}
      {active === 'sepsis' && <Sepsis />}
      {active === 'b1b6' && <B1B6 />}
      {active === 'airway' && <Airway />}
      {active === 'sat-sbt-vap' && <SatSbtVap />}
    </div>
  )
}

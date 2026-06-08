import { useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { computePf, type PfBlock } from '../lib/pf'

interface FormState {
  pao2: string
  fio2: string
  paco2: string
  map: string
  spo2: string
  pplat: string
  peep: string
}

const EMPTY: FormState = { pao2: '', fio2: '', paco2: '', map: '', spo2: '', pplat: '', peep: '' }

function num(s: string): number | undefined {
  const v = parseFloat(s)
  return Number.isNaN(v) ? undefined : v
}

export function Pf() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [blocks, setBlocks] = useState<PfBlock[] | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const update = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  function onCalc() {
    const pao2 = num(form.pao2)
    const fio2 = num(form.fio2)
    if (!pao2 || !fio2) {
      setError('Masukkan PaO₂ dan FiO₂')
      return
    }
    setError('')
    setBlocks(computePf({
      pao2, fio2,
      map: num(form.map),
      spo2: num(form.spo2),
      pplat: num(form.pplat),
      peep: num(form.peep),
      paco2: num(form.paco2),
    }))
    if (window.innerWidth < 769) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  return (
    <>
      <PageHeader title="Kalkulator — P/F & OI" subtitle="Klasifikasi Berlin · Oxygenation Index · Driving Pressure · Tipe Gagal Napas" />

      <div className="calc-box">
        <div className="calc-title"><span>📈</span> P/F Ratio &amp; Oxygenation Index</div>
        <div className="grid2" style={{ gap: 10 }}>
          <div>
            <div className="input-row">
              <label>PaO₂</label>
              <input type="number" inputMode="decimal" placeholder="cth: 90" value={form.pao2} onChange={(e) => update({ pao2: e.target.value })} />
              <span className="unit">mmHg</span>
            </div>
            <div className="input-row">
              <label>FiO₂ <span style={{ fontSize: 10, color: 'var(--muted)' }}>(fraksi 0.21–1.0)</span></label>
              <input type="number" inputMode="decimal" step={0.01} min={0.21} max={1} placeholder="cth: 0.4" value={form.fio2} onChange={(e) => update({ fio2: e.target.value })} />
            </div>
            <div className="input-row">
              <label>PaCO₂ <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label>
              <input type="number" inputMode="decimal" placeholder="tipe gagal napas" value={form.paco2} onChange={(e) => update({ paco2: e.target.value })} />
              <span className="unit">mmHg</span>
            </div>
          </div>
          <div>
            <div className="input-row">
              <label>MAP <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional, untuk OI)</span></label>
              <input type="number" inputMode="decimal" placeholder="mean airway pressure" value={form.map} onChange={(e) => update({ map: e.target.value })} />
              <span className="unit">cmH₂O</span>
            </div>
            <div className="input-row">
              <label>Pplat <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label>
              <input type="number" inputMode="decimal" placeholder="plateau pressure" value={form.pplat} onChange={(e) => update({ pplat: e.target.value })} />
              <span className="unit">cmH₂O</span>
            </div>
            <div className="input-row">
              <label>PEEP <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label>
              <input type="number" inputMode="decimal" placeholder="untuk driving pressure" value={form.peep} onChange={(e) => update({ peep: e.target.value })} />
              <span className="unit">cmH₂O</span>
            </div>
            <div className="input-row">
              <label>SpO₂ <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional, untuk OSI)</span></label>
              <input type="number" inputMode="decimal" placeholder="%" value={form.spo2} onChange={(e) => update({ spo2: e.target.value })} />
              <span className="unit">%</span>
            </div>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalc}>Hitung P/F &amp; OI</button>
        {error && <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>{error}</div>}

        {blocks && (
          <div ref={resultRef} style={{ marginTop: 16 }}>
            {blocks.map((b, i) => (
              <div
                key={b.label}
                className={('abg-result ' + b.cls).trim()}
                style={{ marginTop: i === 0 ? 0 : 6, ...(b.borderColor ? { borderLeftColor: b.borderColor } : {}) }}
              >
                <div className="abg-label" style={{ color: b.color }}>{b.label}</div>
                <div className="abg-interp">{b.interp}</div>
                <div className="abg-detail">{b.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

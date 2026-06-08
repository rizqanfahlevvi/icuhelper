import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { usePatientStore } from '../store/patient'
import { estimateFiO2, interpretAbg, type AbgBlock, type Kondisi } from '../lib/abg'
import { CorrectionCalculators, type AbgImport } from './abg/CorrectionCalculators'

type Fio2Mode = 'direct' | 'lowflow'
type Spo2Source = 'pulse' | 'abg'
type Paco2Unit = 'mmHg' | 'kPa'
type AlbUnit = 'g/dL' | 'mg/dL'

interface AbgForm {
  pH: string
  pco2: string
  po2: string
  hco3: string
  be: string
  spo2: string
  mapV: string
  na: string
  cl: string
  alb: string
  laktat: string
  rr: string
  kondisi: Kondisi
  fio2Direct: string
  o2Device: string
  o2Flow: string
}

const EMPTY: AbgForm = {
  pH: '', pco2: '', po2: '', hco3: '', be: '', spo2: '', mapV: '', na: '', cl: '',
  alb: '', laktat: '', rr: '', kondisi: 'umum', fio2Direct: '', o2Device: 'nasal', o2Flow: '',
}

function num(s: string): number | null {
  const v = parseFloat(s)
  return Number.isNaN(v) ? null : v
}

export function Abg() {
  const session = usePatientStore((s) => s.session)
  const patch = usePatientStore((s) => s.patch)

  const [form, setForm] = useState<AbgForm>(EMPTY)
  const [fio2Mode, setFio2Mode] = useState<Fio2Mode>('direct')
  const [spo2Source, setSpo2Source] = useState<Spo2Source>('pulse')
  const [paco2Unit, setPaco2Unit] = useState<Paco2Unit>('mmHg')
  const [albUnit, setAlbUnit] = useState<AlbUnit>('g/dL')
  const [blocks, setBlocks] = useState<AbgBlock[] | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  // Autofill from shared patient context (canonical mmHg / mmol/L = defaults).
  useEffect(() => {
    setForm((f) => ({
      ...f,
      pH: session.ph != null ? String(session.ph) : f.pH,
      pco2: session.pco2 != null ? String(session.pco2) : f.pco2,
      hco3: session.hco3 != null ? String(session.hco3) : f.hco3,
      po2: session.po2 != null ? String(session.po2) : f.po2,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const up = (p: Partial<AbgForm>) => setForm((f) => ({ ...f, ...p }))

  // FiO₂ estimation (low-flow mode).
  const isVenturi = form.o2Device.startsWith('venturi')
  const fio2Est = fio2Mode === 'lowflow'
    ? estimateFiO2(form.o2Device, parseFloat(form.o2Flow))
    : null

  function canonicalFio2(): number | null {
    if (fio2Mode === 'direct') return num(form.fio2Direct)
    return fio2Est ? fio2Est.fio2 : null
  }

  function canonicalPco2(): number | null {
    const v = num(form.pco2)
    if (v == null) return null
    return paco2Unit === 'kPa' ? v * 7.5006 : v
  }

  function canonicalAlb(): number | null {
    const v = num(form.alb)
    if (v == null) return null
    return albUnit === 'mg/dL' ? v / 1000 : v
  }

  // Toggle PaCO₂ unit and convert the entered value (mirrors legacy).
  function togglePaco2Unit() {
    const next: Paco2Unit = paco2Unit === 'mmHg' ? 'kPa' : 'mmHg'
    const v = num(form.pco2)
    if (v != null) {
      const conv = paco2Unit === 'mmHg' ? v / 7.5006 : v * 7.5006
      up({ pco2: conv.toFixed(paco2Unit === 'mmHg' ? 1 : 0) })
    }
    setPaco2Unit(next)
  }

  function toggleAlbUnit() {
    const next: AlbUnit = albUnit === 'g/dL' ? 'mg/dL' : 'g/dL'
    const v = num(form.alb)
    if (v != null) {
      const conv = albUnit === 'g/dL' ? v * 1000 : v / 1000
      up({ alb: conv.toFixed(albUnit === 'g/dL' ? 0 : 1) })
    }
    setAlbUnit(next)
  }

  function readAbg(): AbgImport {
    return {
      ph: num(form.pH) ?? undefined,
      pco2: canonicalPco2() ?? undefined,
      hco3: num(form.hco3) ?? undefined,
      na: num(form.na) ?? undefined,
      cl: num(form.cl) ?? undefined,
      alb: canonicalAlb() ?? undefined,
    }
  }

  function onInterpret() {
    const pH = num(form.pH)
    const pco2 = canonicalPco2()
    const hco3 = num(form.hco3)
    if (!pH || !pco2 || !hco3) {
      setError('Minimal masukkan pH, PaCO₂, dan HCO₃⁻')
      return
    }
    setError('')
    const po2 = num(form.po2)

    patch({
      ph: pH,
      pco2,
      hco3,
      po2: po2 ?? undefined,
    })

    setBlocks(interpretAbg({
      pH, pco2, hco3,
      be: num(form.be) ?? 0,
      po2,
      spo2: num(form.spo2),
      fio2: canonicalFio2(),
      mapV: num(form.mapV),
      na: num(form.na),
      cl: num(form.cl),
      alb: canonicalAlb(),
      laktat: num(form.laktat),
      rr: num(form.rr),
      kondisi: form.kondisi,
      spo2Source,
      paco2Unit,
      albUnit,
    }))

    if (window.innerWidth < 769) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  function onReset() {
    setForm(EMPTY)
    setFio2Mode('direct')
    setSpo2Source('pulse')
    setBlocks(null)
    setError('')
  }

  return (
    <>
      <PageHeader title="ABG Interpreter" subtitle="Analisis Gas Darah 6-Langkah · Delta-Delta · ROX Index · A-a Gradient" />

      <div className="calc-box">
        <div className="calc-title"><span>🩸</span> ABG Interpreter Lengkap — 6 Langkah + Metabolik + Oksigenasi</div>
        <div className="info" style={{ marginBottom: 12 }}>
          Masukkan seluruh parameter untuk interpretasi sistematis: asam-basa, kompensasi, anion gap, delta-delta, P/F ratio, OI, ROX index, klasifikasi gagal napas, dan saran klinis.
        </div>

        <div className="grid2" style={{ gap: 10, marginBottom: 12 }}>
          <div>
            <div className="subsec">Parameter Dasar</div>
            <div className="input-row"><label>pH</label><input type="number" inputMode="decimal" step={0.01} placeholder="7.35–7.45" value={form.pH} onChange={(e) => up({ pH: e.target.value })} /></div>
            <div className="input-row">
              <label>PaCO₂</label>
              <div className="input-unit-wrap">
                <input type="number" inputMode="decimal" placeholder={paco2Unit === 'kPa' ? '4.7–6.0' : '35–45'} value={form.pco2} onChange={(e) => up({ pco2: e.target.value })} />
                <button className="unit-toggle-btn" onClick={togglePaco2Unit}>{paco2Unit}</button>
              </div>
            </div>
            <div className="input-row"><label>PaO₂ (mmHg)</label><input type="number" inputMode="decimal" placeholder="80–100" value={form.po2} onChange={(e) => up({ po2: e.target.value })} /></div>
            <div className="input-row"><label>HCO₃⁻ (mmol/L)</label><input type="number" inputMode="decimal" step={0.1} placeholder="22–26" value={form.hco3} onChange={(e) => up({ hco3: e.target.value })} /></div>
            <div className="input-row"><label>BE (mEq/L)</label><input type="number" inputMode="decimal" step={0.1} placeholder="-2 s/d +2" value={form.be} onChange={(e) => up({ be: e.target.value })} /></div>
          </div>

          <div>
            <div className="subsec">Parameter Oksigenasi & Elektrolit</div>
            <div className="input-row">
              <label>SpO₂ / SaO₂ (%)</label>
              <div style={{ flex: 1 }}>
                <div className="fio2-mode-bar">
                  <button className={'fio2-mode-btn' + (spo2Source === 'pulse' ? ' active' : '')} onClick={() => setSpo2Source('pulse')}>💡 SpO₂ (Pulse Ox)</button>
                  <button className={'fio2-mode-btn' + (spo2Source === 'abg' ? ' active' : '')} onClick={() => setSpo2Source('abg')}>🔬 SaO₂ (ABG)</button>
                </div>
                {spo2Source === 'pulse' && (
                  <div className="spo2-source-note">Pulse ox ±2–4% dari SaO₂; dipengaruhi perfusi perifer, methHb, COHb. Tidak akurat pada vasokonstriksi perifer, methemoglobin, COHb tinggi (Jubran A, Crit Care 2015)</div>
                )}
                <input type="number" inputMode="decimal" placeholder="94–99" value={form.spo2} onChange={(e) => up({ spo2: e.target.value })} />
              </div>
            </div>

            <div className="input-row">
              <label>FiO₂</label>
              <div style={{ flex: 1 }}>
                <div className="fio2-mode-bar">
                  <button className={'fio2-mode-btn' + (fio2Mode === 'direct' ? ' active' : '')} onClick={() => setFio2Mode('direct')}>🔢 Direct Input</button>
                  <button className={'fio2-mode-btn' + (fio2Mode === 'lowflow' ? ' active' : '')} onClick={() => setFio2Mode('lowflow')}>💨 Low-Flow O₂</button>
                </div>
                {fio2Mode === 'direct' ? (
                  <input type="number" inputMode="decimal" step={0.01} min={0.21} max={1} placeholder="0.21–1.0" value={form.fio2Direct} onChange={(e) => up({ fio2Direct: e.target.value })} />
                ) : (
                  <>
                    <select className="abg-lowflow-input" value={form.o2Device} onChange={(e) => up({ o2Device: e.target.value })}>
                      <option value="nasal">Nasal Cannula</option>
                      <option value="simple">Simple Mask</option>
                      <option value="nrm">Non-Rebreathing Mask</option>
                      <option value="venturi24">Venturi 24%</option>
                      <option value="venturi28">Venturi 28%</option>
                      <option value="venturi31">Venturi 31%</option>
                      <option value="venturi35">Venturi 35%</option>
                      <option value="venturi40">Venturi 40%</option>
                      <option value="venturi60">Venturi 60%</option>
                    </select>
                    {!isVenturi && (
                      <input className="abg-lowflow-input" type="number" inputMode="decimal" placeholder="Flow (L/menit)" min={1} max={15} step={0.5} value={form.o2Flow} onChange={(e) => up({ o2Flow: e.target.value })} />
                    )}
                    {fio2Est?.text && <div className="abg-fio2-est">{fio2Est.text}</div>}
                  </>
                )}
              </div>
            </div>

            <div className="input-row"><label>MAP ventilator (cmH₂O)</label><input type="number" inputMode="decimal" step={0.1} placeholder="opsional" value={form.mapV} onChange={(e) => up({ mapV: e.target.value })} /></div>
            <div className="input-row"><label>Na⁺ (mmol/L)</label><input type="number" inputMode="decimal" placeholder="135–145" value={form.na} onChange={(e) => up({ na: e.target.value })} /></div>
            <div className="input-row"><label>Cl⁻ (mmol/L)</label><input type="number" inputMode="decimal" placeholder="96–106" value={form.cl} onChange={(e) => up({ cl: e.target.value })} /></div>
            <div className="input-row">
              <label>Albumin</label>
              <div className="input-unit-wrap">
                <input type="number" inputMode="decimal" step={albUnit === 'mg/dL' ? 100 : 0.1} placeholder={albUnit === 'mg/dL' ? '3500–5000' : '3.5–5 (opsional)'} value={form.alb} onChange={(e) => up({ alb: e.target.value })} />
                <button className="unit-toggle-btn" onClick={toggleAlbUnit}>{albUnit}</button>
              </div>
            </div>
            <div className="input-row"><label>Laktat (mmol/L)</label><input type="number" inputMode="decimal" step={0.1} placeholder="<2 normal (opsional)" value={form.laktat} onChange={(e) => up({ laktat: e.target.value })} /></div>
            <div className="input-row"><label>RR spontan (/mnt)</label><input type="number" inputMode="decimal" placeholder="untuk ROX index" value={form.rr} onChange={(e) => up({ rr: e.target.value })} /></div>
            <div className="input-row"><label>Kondisi klinis</label>
              <select value={form.kondisi} onChange={(e) => up({ kondisi: e.target.value as Kondisi })}>
                <option value="umum">Umum / ICU</option>
                <option value="ards">ARDS</option>
                <option value="copd">PPOK</option>
                <option value="asthma">Asma</option>
                <option value="sepsis">Sepsis</option>
                <option value="cardiac">Edema Paru Kardiogenik</option>
                <option value="postop">Post-Operasi</option>
              </select>
            </div>
          </div>
        </div>

        <button className="calc-btn" onClick={onInterpret}>Interpretasi ABG</button>
        <button className="calc-btn-sec" onClick={onReset}>Reset</button>
        {error && <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>{error}</div>}

        {blocks && (
          <div ref={resultRef} style={{ marginTop: 16 }}>
            {blocks.map((b, i) => <AbgBlockView key={i} block={b} first={i === 0} />)}
          </div>
        )}
      </div>

      <CorrectionCalculators readAbg={readAbg} />
    </>
  )
}

function AbgBlockView({ block, first }: { block: AbgBlock; first: boolean }) {
  const mt = first ? 0 : 6
  if (block.kind === 'warn') {
    return (
      <div className="warn" style={{ marginTop: 8, marginBottom: 0 }}>
        <strong>⚠ Disclaimer Klinis</strong> {block.text}
      </div>
    )
  }
  if (block.kind === 'mgmt') {
    return (
      <div className="abg-result abg-blue" style={{ marginTop: mt }}>
        <div className="abg-label" style={{ color: 'var(--blue)' }}>{block.label}</div>
        {block.cards.map((c, i) => (
          <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, color: c.color, marginBottom: 5, fontSize: 12, letterSpacing: '0.02em' }}>🎯 {c.judul}</div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {c.isi.map((s, j) => <li key={j} style={{ fontSize: 12, marginBottom: 3, lineHeight: 1.5 }}>{s}</li>)}
            </ul>
            <span className="ref-tag" style={{ display: 'block', marginTop: 5 }}>📚 {c.ref}</span>
          </div>
        ))}
      </div>
    )
  }
  if (block.kind === 'list') {
    return (
      <div className={`abg-result ${block.cls}`} style={{ marginTop: mt }}>
        <div className="abg-label" style={{ color: block.labelColor }}>{block.label}</div>
        <ul style={{ paddingLeft: 16, marginTop: 4 }}>
          {block.items.map((s, i) => <li key={i} style={{ fontSize: 12, marginBottom: 4 }}>{s}</li>)}
        </ul>
      </div>
    )
  }
  // step
  return (
    <div className={`abg-result ${block.cls}`} style={{ marginTop: mt }}>
      <div className="abg-label" style={{ color: block.labelColor }}>{block.label}</div>
      {block.interp && <div className="abg-interp">{block.interp}</div>}
      {block.details?.map((d, i) => <div key={i} className="abg-detail" style={{ marginTop: i === 0 ? undefined : 4 }}>{d}</div>)}
    </div>
  )
}

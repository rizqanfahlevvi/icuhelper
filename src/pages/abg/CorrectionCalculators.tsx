import { useState } from 'react'
import {
  calcBicarb, calcAlk, calcKompensasi, calcAGStandalone,
  type AcbcResult, type BicarbType, type Disorder,
} from '../../lib/acidbase'

export interface AbgImport {
  ph?: number
  pco2?: number
  hco3?: number
  na?: number
  cl?: number
  alb?: number
}

function n(s: string): number {
  return parseFloat(s)
}

function AcbcCard({ r }: { r: AcbcResult }) {
  return (
    <div className={`acbc-result ${r.cls}`}>
      <div className="acbc-result-title">{r.title}</div>
      {r.val && (
        <div className="acbc-val">
          {r.val}
          {r.valSub && <span style={{ fontSize: 13, fontWeight: 400 }}> {r.valSub}</span>}
        </div>
      )}
      {r.lines?.map((l, i) => <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>{l}</div>)}
      {r.formula && <div className="acbc-formula">{r.formula}</div>}
      {r.ref && <span className="ref-tag">📚 {r.ref}</span>}
    </div>
  )
}

export function CorrectionCalculators({ readAbg }: { readAbg: () => AbgImport }) {
  const [tab, setTab] = useState(1)

  // Panel 1 — NaHCO3
  const [p1, setP1] = useState({ bb: '', hco3act: '', hco3tgt: '18', type: 'met' as BicarbType })
  // Panel 2 — KCl / HCl
  const [p2, setP2] = useState({ bb: '', hco3: '', k: '', cl: '' })
  // Panel 3 — Kompensasi
  const [p3, setP3] = useState({ ph: '', pco2: '', hco3: '', disorder: '' as '' | Disorder })
  // Panel 4 — Anion Gap
  const [p4, setP4] = useState({ na: '', cl: '', hco3: '', alb: '4.0' })

  function importInto(panel: number) {
    const v = readAbg()
    let imported = 0
    if (panel === 1) {
      if (v.hco3 != null) { setP1((s) => ({ ...s, hco3act: v.hco3!.toFixed(1) })); imported++ }
    } else if (panel === 2) {
      if (v.hco3 != null) { setP2((s) => ({ ...s, hco3: v.hco3!.toFixed(1) })); imported++ }
    } else if (panel === 3) {
      setP3((s) => ({
        ...s,
        ph: v.ph != null ? String(v.ph) : s.ph,
        pco2: v.pco2 != null ? v.pco2.toFixed(1) : s.pco2,
        hco3: v.hco3 != null ? v.hco3.toFixed(1) : s.hco3,
      }))
      if (v.ph != null || v.pco2 != null || v.hco3 != null) imported++
    } else if (panel === 4) {
      setP4((s) => ({
        ...s,
        na: v.na != null ? v.na.toFixed(1) : s.na,
        cl: v.cl != null ? v.cl.toFixed(1) : s.cl,
        hco3: v.hco3 != null ? v.hco3.toFixed(1) : s.hco3,
        alb: v.alb != null ? v.alb.toFixed(1) : s.alb,
      }))
      if (v.na != null || v.cl != null || v.hco3 != null || v.alb != null) imported++
    }
    if (imported === 0) alert('Belum ada nilai ABG yang diisi. Isi dulu form ABG Interpreter di atas.')
  }

  // Live results
  const r1: AcbcResult[] = (!Number.isNaN(n(p1.bb)) && !Number.isNaN(n(p1.hco3act)))
    ? calcBicarb(n(p1.bb), n(p1.hco3act), p1.type, n(p1.hco3tgt) || 18)
    : []
  const r2: AcbcResult[] = (!Number.isNaN(n(p2.bb)) && !Number.isNaN(n(p2.hco3)))
    ? calcAlk(n(p2.bb), n(p2.hco3), Number.isNaN(n(p2.k)) ? undefined : n(p2.k), Number.isNaN(n(p2.cl)) ? undefined : n(p2.cl))
    : []
  const r3: AcbcResult[] = p3.disorder
    ? calcKompensasi(Number.isNaN(n(p3.pco2)) ? undefined : n(p3.pco2), Number.isNaN(n(p3.hco3)) ? undefined : n(p3.hco3), p3.disorder)
    : []
  const r4: AcbcResult[] = (!Number.isNaN(n(p4.na)) && !Number.isNaN(n(p4.cl)) && !Number.isNaN(n(p4.hco3)))
    ? calcAGStandalone(n(p4.na), n(p4.cl), n(p4.hco3), Number.isNaN(n(p4.alb)) ? undefined : n(p4.alb))
    : []

  const tabBtn = (idx: number, label: string, sub: string) => (
    <button
      type="button"
      className={'acbc-tab' + (tab === idx ? ' active' : '')}
      onClick={() => setTab(idx)}
    >
      {label}<br /><span style={{ fontWeight: 400, fontSize: 10 }}>{sub}</span>
    </button>
  )

  const importBtn = (panel: number, label: string) => (
    <button className="acbc-import-btn" onClick={() => importInto(panel)}>⬇ {label}</button>
  )

  return (
    <div className="calc-box" style={{ marginTop: 12 }}>
      <div className="calc-title"><span>🧮</span> Kalkulator Koreksi Asam-Basa</div>
      <div className="calc-sub">Hitung dosis koreksi, formula kompensasi, dan analisis anion gap — mandiri atau import dari ABG Interpreter di atas.</div>

      <div className="acbc-tab-bar">
        {tabBtn(1, '💊 NaHCO₃', 'Asidosis Met.')}
        {tabBtn(2, '⚗️ KCl / HCl', 'Alkalosis Met.')}
        {tabBtn(3, '📐 Kompensasi', '6 Formula')}
        {tabBtn(4, '🔬 AG + Δ/Δ', 'Anion Gap')}
      </div>

      {tab === 1 && (
        <div className="acbc-panel active">
          {importBtn(1, 'Import dari ABG Interpreter — HCO₃⁻ aktual')}
          <div className="input-row"><label>Berat Badan Ideal (kg)</label><input type="number" inputMode="decimal" placeholder="e.g. 60" value={p1.bb} onChange={(e) => setP1({ ...p1, bb: e.target.value })} /></div>
          <div className="input-row"><label>HCO₃⁻ Aktual (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 10" value={p1.hco3act} onChange={(e) => setP1({ ...p1, hco3act: e.target.value })} /></div>
          <div className="input-row"><label>Target HCO₃⁻ (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 18" value={p1.hco3tgt} onChange={(e) => setP1({ ...p1, hco3tgt: e.target.value })} disabled={p1.type !== 'met'} /></div>
          <div className="input-row"><label>Jenis Asidosis</label>
            <select value={p1.type} onChange={(e) => setP1({ ...p1, type: e.target.value as BicarbType })}>
              <option value="met">Asidosis Metabolik</option>
              <option value="dka">DKA (target HCO₃ 15)</option>
              <option value="card">Cardiac Arrest (bolus)</option>
            </select>
          </div>
          <div>{r1.map((r, i) => <AcbcCard key={i} r={r} />)}</div>
        </div>
      )}

      {tab === 2 && (
        <div className="acbc-panel active">
          {importBtn(2, 'Import dari ABG Interpreter — HCO₃⁻, Cl⁻')}
          <div className="input-row"><label>Berat Badan (kg)</label><input type="number" inputMode="decimal" placeholder="e.g. 60" value={p2.bb} onChange={(e) => setP2({ ...p2, bb: e.target.value })} /></div>
          <div className="input-row"><label>HCO₃⁻ Aktual (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 38" value={p2.hco3} onChange={(e) => setP2({ ...p2, hco3: e.target.value })} /></div>
          <div className="input-row"><label>Kalium K⁺ Serum (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 2.8" value={p2.k} onChange={(e) => setP2({ ...p2, k: e.target.value })} /></div>
          <div className="input-row"><label>Klorida Cl⁻ Serum (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 88" value={p2.cl} onChange={(e) => setP2({ ...p2, cl: e.target.value })} /></div>
          <div>{r2.map((r, i) => <AcbcCard key={i} r={r} />)}</div>
        </div>
      )}

      {tab === 3 && (
        <div className="acbc-panel active">
          {importBtn(3, 'Import dari ABG Interpreter — pH, PaCO₂, HCO₃⁻')}
          <div className="input-row"><label>pH</label><input type="number" inputMode="decimal" placeholder="e.g. 7.28" value={p3.ph} onChange={(e) => setP3({ ...p3, ph: e.target.value })} /></div>
          <div className="input-row"><label>PaCO₂ (mmHg)</label><input type="number" inputMode="decimal" placeholder="e.g. 28" value={p3.pco2} onChange={(e) => setP3({ ...p3, pco2: e.target.value })} /></div>
          <div className="input-row"><label>HCO₃⁻ Aktual (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 14" value={p3.hco3} onChange={(e) => setP3({ ...p3, hco3: e.target.value })} /></div>
          <div className="input-row"><label>Gangguan Primer</label>
            <select value={p3.disorder} onChange={(e) => setP3({ ...p3, disorder: e.target.value as '' | Disorder })}>
              <option value="">— pilih —</option>
              <option value="am">Asidosis Metabolik</option>
              <option value="alm">Alkalosis Metabolik</option>
              <option value="ar">Asidosis Respiratorik Akut</option>
              <option value="arc">Asidosis Respiratorik Kronik</option>
              <option value="alr">Alkalosis Respiratorik Akut</option>
              <option value="alrc">Alkalosis Respiratorik Kronik</option>
            </select>
          </div>
          <div>
            {!p3.disorder
              ? <div className="acbc-note">Pilih gangguan primer untuk melihat formula kompensasi.</div>
              : r3.length === 0
                ? <div className="acbc-note">Isi pH / PaCO₂ / HCO₃⁻ untuk melihat hasil kompensasi.</div>
                : r3.map((r, i) => <AcbcCard key={i} r={r} />)}
          </div>
        </div>
      )}

      {tab === 4 && (
        <div className="acbc-panel active">
          {importBtn(4, 'Import dari ABG Interpreter — Na⁺, Cl⁻, HCO₃⁻, Albumin')}
          <div className="input-row"><label>Na⁺ (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 140" value={p4.na} onChange={(e) => setP4({ ...p4, na: e.target.value })} /></div>
          <div className="input-row"><label>Cl⁻ (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 104" value={p4.cl} onChange={(e) => setP4({ ...p4, cl: e.target.value })} /></div>
          <div className="input-row"><label>HCO₃⁻ (mEq/L)</label><input type="number" inputMode="decimal" placeholder="e.g. 24" value={p4.hco3} onChange={(e) => setP4({ ...p4, hco3: e.target.value })} /></div>
          <div className="input-row"><label>Albumin (g/dL)</label><input type="number" inputMode="decimal" placeholder="e.g. 4.0" value={p4.alb} onChange={(e) => setP4({ ...p4, alb: e.target.value })} /></div>
          <div>{r4.map((r, i) => <AcbcCard key={i} r={r} />)}</div>
        </div>
      )}
    </div>
  )
}

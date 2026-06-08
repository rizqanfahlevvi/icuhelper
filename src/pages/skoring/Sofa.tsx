import { useState } from 'react'
import { computeSofa, type SofaInput } from '../../lib/skoring'
import { ScoreHeader, SkoRows } from './parts'

const DEF: SofaInput = { vent: 'no', cv: '', pao2: undefined, fio2: undefined, plt: undefined, bili: undefined, gcs: undefined, cr: undefined, uo: undefined, baseline: undefined }

export function Sofa() {
  const [f, setF] = useState<SofaInput>(DEF)
  const [res, setRes] = useState<ReturnType<typeof computeSofa> | null>(null)

  const n = (k: keyof SofaInput, v: string) => setF(p => ({ ...p, [k]: v === '' ? undefined : parseFloat(v) }))

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>SOFA Score</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Sequential Organ Failure Assessment — 6 sistem organ</p>

      <div className="form-grid">
        <label>PaO₂ (mmHg)<input type="number" placeholder="mis. 80" onBlur={e => n('pao2', e.target.value)} /></label>
        <label>FiO₂ (0–1)<input type="number" placeholder="mis. 0.4" step="0.01" onBlur={e => n('fio2', e.target.value)} /></label>
        <label>Ventilasi Mekanik?
          <select value={f.vent} onChange={e => setF(p => ({ ...p, vent: e.target.value as 'yes' | 'no' }))}>
            <option value="no">Tidak</option>
            <option value="yes">Ya</option>
          </select>
        </label>
        <label>Trombosit (×10³/µL)<input type="number" placeholder="mis. 120" onBlur={e => n('plt', e.target.value)} /></label>
        <label>Bilirubin (mg/dL)<input type="number" placeholder="mis. 1.5" step="0.1" onBlur={e => n('bili', e.target.value)} /></label>
        <label>Kardiovaskular (MAP/Vasopressor)
          <select value={f.cv} onChange={e => setF(p => ({ ...p, cv: e.target.value }))}>
            <option value="">— pilih —</option>
            <option value="0">0 — MAP≥70 tanpa vasopressor</option>
            <option value="1">1 — MAP &lt;70 tanpa vasopressor</option>
            <option value="2">2 — Dopamine ≤5 atau Dobutamine</option>
            <option value="3">3 — Dopamine 5–15 / Epi,NE ≤0.1</option>
            <option value="4">4 — Dopamine &gt;15 / Epi,NE &gt;0.1</option>
          </select>
        </label>
        <label>GCS<input type="number" placeholder="3–15" min={3} max={15} onBlur={e => n('gcs', e.target.value)} /></label>
        <label>Kreatinin (mg/dL)<input type="number" placeholder="mis. 1.2" step="0.1" onBlur={e => n('cr', e.target.value)} /></label>
        <label>Urine Output (mL/hari)<input type="number" placeholder="mis. 800" onBlur={e => n('uo', e.target.value)} /></label>
        <label>SOFA Baseline (opsional)<input type="number" placeholder="mis. 2" onBlur={e => n('baseline', e.target.value)} /></label>
      </div>

      <button className="btn-calc" onClick={() => setRes(computeSofa(f))}>Hitung SOFA</button>

      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <ScoreHeader total={res.total} label="SOFA Score" interp={res.interp} detail={res.detail} color={res.color}>
            {res.sepsis3Delta != null && (
              <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠️ SEPSIS-3: ΔSOFA ≥2 dari baseline ({res.baseline}) → Δ={res.sepsis3Delta}</div>
            )}
          </ScoreHeader>
          {res.missing.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Data tidak tersedia: {res.missing.join(', ')}</p>
          )}
          <SkoRows rows={res.rows} />
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { computeApache, type ApacheInput } from '../../lib/skoring'
import { ScoreHeader } from './parts'

const DEF: ApacheInput = {
  temp: undefined, map: undefined, hr: undefined, rr: undefined,
  fio2: undefined, pao2: undefined, paco2: undefined, ph: undefined,
  na: undefined, k: undefined, cr: undefined, aki: false,
  hct: undefined, wbc: undefined, gcs: undefined, age: undefined,
  chronic: false, chronicType: 'elective',
}

export function Apache() {
  const [f, setF] = useState<ApacheInput>(DEF)
  const [res, setRes] = useState<ReturnType<typeof computeApache> | null>(null)

  const n = (k: keyof ApacheInput, v: string) => setF(p => ({ ...p, [k]: v === '' ? undefined : parseFloat(v) }))
  const b = (k: 'aki' | 'chronic', v: boolean) => setF(p => ({ ...p, [k]: v }))

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>APACHE-II</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Acute Physiology And Chronic Health Evaluation II · Skor APS + Usia + Komorbid</p>

      <div className="form-grid">
        <label>Suhu rektal (°C)<input type="number" placeholder="36.5" step="0.1" onBlur={e => n('temp', e.target.value)} /></label>
        <label>MAP (mmHg)<input type="number" placeholder="70" onBlur={e => n('map', e.target.value)} /></label>
        <label>Nadi (bpm)<input type="number" placeholder="80" onBlur={e => n('hr', e.target.value)} /></label>
        <label>Frekuensi Napas (/mnt)<input type="number" placeholder="18" onBlur={e => n('rr', e.target.value)} /></label>
        <label>FiO₂ (0–1)<input type="number" placeholder="0.21" step="0.01" onBlur={e => n('fio2', e.target.value)} /></label>
        <label>PaO₂ (mmHg)<input type="number" placeholder="90" onBlur={e => n('pao2', e.target.value)} /></label>
        <label>PaCO₂ (mmHg, jika FiO₂≥0.5)<input type="number" placeholder="40" onBlur={e => n('paco2', e.target.value)} /></label>
        <label>pH Arteri<input type="number" placeholder="7.40" step="0.01" onBlur={e => n('ph', e.target.value)} /></label>
        <label>Natrium (mEq/L)<input type="number" placeholder="140" onBlur={e => n('na', e.target.value)} /></label>
        <label>Kalium (mEq/L)<input type="number" placeholder="4.0" step="0.1" onBlur={e => n('k', e.target.value)} /></label>
        <label>Kreatinin (mg/dL)<input type="number" placeholder="1.0" step="0.1" onBlur={e => n('cr', e.target.value)} /></label>
        <label style={{ gridColumn: '1/-1', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={f.aki} onChange={e => b('aki', e.target.checked)} />
          AKI (Gagal Ginjal Akut) — skor kreatinin ×2
        </label>
        <label>Hematokrit (%)<input type="number" placeholder="40" step="0.1" onBlur={e => n('hct', e.target.value)} /></label>
        <label>Leukosit (×1000/mm³)<input type="number" placeholder="8" step="0.1" onBlur={e => n('wbc', e.target.value)} /></label>
        <label>GCS<input type="number" placeholder="15" min={3} max={15} onBlur={e => n('gcs', e.target.value)} /></label>
        <label>Usia (tahun)<input type="number" placeholder="50" onBlur={e => n('age', e.target.value)} /></label>
        <label style={{ gridColumn: '1/-1', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={f.chronic} onChange={e => b('chronic', e.target.checked)} />
          Penyakit kronik berat (Hepar, Kardiovaskular, Paru, Ginjal, Imunosupresi)
        </label>
        {f.chronic && (
          <label>Tipe Masuk Rumah Sakit
            <select value={f.chronicType} onChange={e => setF(p => ({ ...p, chronicType: e.target.value as 'elective' | 'emergency' }))}>
              <option value="elective">Elektif / Post-bedah elektif (+2)</option>
              <option value="emergency">Emergensi / Non-bedah / Post-bedah darurat (+5)</option>
            </select>
          </label>
        )}
      </div>

      <button className="btn-calc" onClick={() => setRes(computeApache(f))}>Hitung APACHE-II</button>

      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <ScoreHeader total={res.total} label="APACHE-II Score" interp={`Mortalitas Estimasi: ${res.mort}`} color={res.color}
            detail={`APS=${res.aps} + Usia=${res.ageScore} + Komorbid=${res.chronicScore}`} />
          {res.missing.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Data tidak tersedia (dihitung 0): {res.missing.join(', ')}</p>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>Parameter</th>
                  <th style={{ textAlign: 'center', padding: '4px 8px' }}>Nilai</th>
                  <th style={{ textAlign: 'center', padding: '4px 8px' }}>Poin</th>
                </tr>
              </thead>
              <tbody>
                {res.rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', opacity: r.skipped ? 0.5 : 1 }}>
                    <td style={{ padding: '4px 8px' }}>{r.label}</td>
                    <td style={{ textAlign: 'center', padding: '4px 8px', color: 'var(--muted)' }}>{r.val || '—'}</td>
                    <td style={{ textAlign: 'center', padding: '4px 8px', fontWeight: r.pts > 0 ? 700 : 400 }}>{r.skipped ? '—' : r.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { computeCpis, type CpisInput } from '../../lib/skoring'
import { ScoreHeader, SkoRows } from './parts'

const DEF: CpisInput = { temp: undefined, wbc: undefined, band: 'no', sec: 0, pao2: undefined, fio2: undefined, ards: 'no', xray: 0, culture: '' }

export function Cpis() {
  const [f, setF] = useState<CpisInput>(DEF)
  const [res, setRes] = useState<ReturnType<typeof computeCpis> | null>(null)

  const n = (k: 'temp' | 'wbc' | 'pao2' | 'fio2', v: string) => setF(p => ({ ...p, [k]: v === '' ? undefined : parseFloat(v) }))

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>CPIS — VAP Score</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Clinical Pulmonary Infection Score · Diagnosis & De-eskalasi VAP</p>

      <div className="form-grid">
        <label>Suhu (°C)<input type="number" placeholder="37.0" step="0.1" onBlur={e => n('temp', e.target.value)} /></label>
        <label>Leukosit (sel/mm³)<input type="number" placeholder="8000" onBlur={e => n('wbc', e.target.value)} /></label>
        <label>Band Forms ≥50%?
          <select value={f.band} onChange={e => setF(p => ({ ...p, band: e.target.value as 'yes' | 'no' }))}>
            <option value="no">Tidak</option>
            <option value="yes">Ya (+1 tambahan)</option>
          </select>
        </label>
        <label>Sekret Trakeal
          <select value={f.sec} onChange={e => setF(p => ({ ...p, sec: parseInt(e.target.value) }))}>
            <option value="0">0 — Tidak ada / sedikit</option>
            <option value="1">1 — Non-purulen</option>
            <option value="2">2 — Purulen</option>
          </select>
        </label>
        <label>PaO₂ (mmHg)<input type="number" placeholder="80" onBlur={e => n('pao2', e.target.value)} /></label>
        <label>FiO₂ (0–1)<input type="number" placeholder="0.4" step="0.01" onBlur={e => n('fio2', e.target.value)} /></label>
        <label>Ada ARDS?
          <select value={f.ards} onChange={e => setF(p => ({ ...p, ards: e.target.value as 'yes' | 'no' }))}>
            <option value="no">Tidak</option>
            <option value="yes">Ya (oksigenasi = 0)</option>
          </select>
        </label>
        <label>Foto Thorax
          <select value={f.xray} onChange={e => setF(p => ({ ...p, xray: parseInt(e.target.value) }))}>
            <option value="0">0 — Tidak ada infiltrat</option>
            <option value="1">1 — Infiltrat difus/patchy</option>
            <option value="2">2 — Infiltrat lokal/segmental</option>
          </select>
        </label>
        <label>Hasil Kultur Trakeal (opsional)
          <select value={f.culture} onChange={e => setF(p => ({ ...p, culture: e.target.value }))}>
            <option value="">— belum ada hasil —</option>
            <option value="0">0 — Tidak ada patogen</option>
            <option value="1">1 — Patogen ditemukan</option>
            <option value="2">2 — Patogen + Gram stain sesuai</option>
          </select>
        </label>
      </div>

      <button className="btn-calc" onClick={() => setRes(computeCpis(f))}>Hitung CPIS</button>

      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <ScoreHeader total={res.total} label="CPIS Score" interp={res.interp} color={res.color} />
          <div style={{ fontSize: 13, background: res.color === 'green' ? 'var(--green-bg, #f0fff4)' : 'var(--red-bg, #fff5f5)', borderRadius: 8, padding: 12, marginBottom: 12, lineHeight: 1.6 }}>
            {res.action}
          </div>
          {res.missing.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Data tidak tersedia (tidak dihitung): {res.missing.join(', ')}</p>
          )}
          <SkoRows rows={res.rows} />
        </div>
      )}
    </div>
  )
}

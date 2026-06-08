import { useState } from 'react'
import { computeCamIcu, type YesNo } from '../../lib/skoring'

function YNBtn({ val, cur, onChange }: { val: YesNo; cur: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['yes', 'no'] as YesNo[]).map(v => (
        <button key={v as string} onClick={() => onChange(val === v ? null : v)} style={{
          padding: '6px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13,
          background: cur === v ? (v === 'yes' ? 'var(--red)' : 'var(--green)') : 'var(--surface2, var(--bg))',
          color: cur === v ? '#fff' : 'var(--text)',
          border: `1.5px solid ${cur === v ? (v === 'yes' ? 'var(--red)' : 'var(--green)') : 'var(--border)'}`,
          cursor: 'pointer',
        }}>{v === 'yes' ? 'Ya (+)' : 'Tidak (−)'}</button>
      ))}
    </div>
  )
}

export function CamIcu() {
  const [f1, setF1] = useState<YesNo>(null)
  const [f2, setF2] = useState<YesNo>(null)
  const [f3, setF3] = useState<YesNo>(null)
  const [f4, setF4] = useState<YesNo>(null)

  const res = (f1 && f2) ? computeCamIcu(f1, f2, f3, f4) : null

  return (
    <div className="calc-box">
      <h2 style={{ marginBottom: 4 }}>CAM-ICU — Delirium</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Confusion Assessment Method for the ICU · Prasyarat: RASS ≥ −3</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Fitur 1 — Perubahan Akut atau Fluktuasi Status Mental</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Apakah ada perubahan status mental akut dari baseline, atau fluktuasi dalam 24 jam terakhir (RASS atau GCS berfluktuasi)?</div>
          <YNBtn val={f1} cur={f1} onChange={setF1} />
        </div>

        {f1 === 'yes' && (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Fitur 2 — Gangguan Perhatian (Inattention)</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Apakah pasien kesulitan memusatkan perhatian? ASE (Audio/Visual) skor &lt;8 dari 10?</div>
            <YNBtn val={f2} cur={f2} onChange={setF2} />
          </div>
        )}

        {f1 === 'yes' && f2 === 'yes' && (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Fitur 3 — Pemikiran Tidak Terorganisir (Disorganized Thinking)</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Apakah ada pikiran tidak terorganisir? Jawaban Ya/Tidak tidak konsisten, atau tidak dapat mengikuti perintah 4 langkah?</div>
            <YNBtn val={f3} cur={f3} onChange={setF3} />
          </div>
        )}

        {f1 === 'yes' && f2 === 'yes' && (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Fitur 4 — Perubahan Tingkat Kesadaran</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>RASS saat ini ≠ 0 (bukan Alert & Calm)?</div>
            <YNBtn val={f4} cur={f4} onChange={setF4} />
          </div>
        )}
      </div>

      {res && !('error' in res) && (
        <div className={`result-card`} style={{ marginTop: 16, borderLeft: `4px solid var(--${res.result === 'positif' ? 'red' : 'green'})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: `var(--${res.result === 'positif' ? 'red' : 'green'})` }}>
              {res.result === 'positif' ? '⚠️' : '✓'}
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>CAM-ICU</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: `var(--${res.result === 'positif' ? 'red' : 'green'})` }}>
                {res.result === 'positif' ? 'POSITIF — Delirium Terdeteksi' : 'NEGATIF — Tidak Ada Delirium'}
              </div>
            </div>
          </div>
          {res.reason && <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{res.reason}</p>}
          {res.result === 'positif' && (
            <div style={{ fontSize: 13, background: 'var(--red-bg, #fff5f5)', borderRadius: 8, padding: 12, lineHeight: 1.6 }}>
              <strong>Tindakan:</strong> Identifikasi & koreksi penyebab reversibel (hipoksia, nyeri, retensi urin, infeksi, obat). Aktifkan protokol ABCDEF Bundle. Hindari benzodiazepin. Pertimbangkan dexmedetomidine jika agitasi berat. Reorientasi & mobilisasi dini.
            </div>
          )}
        </div>
      )}
      {res && 'error' in res && (
        <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>{res.error}</div>
      )}
    </div>
  )
}

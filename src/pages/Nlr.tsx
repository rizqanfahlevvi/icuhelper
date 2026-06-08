import { useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { computeNlr, type NlrMetrics } from '../lib/nlr'

type Mode = 'abs' | 'pct'

interface AbsForm { neut: string; lymph: string; mono: string; plt: string; wbc: string }
interface PctForm { wbc: string; neut: string; lymph: string; mono: string; plt: string }

const EMPTY_ABS: AbsForm = { neut: '', lymph: '', mono: '', plt: '', wbc: '' }
const EMPTY_PCT: PctForm = { wbc: '', neut: '', lymph: '', mono: '', plt: '' }

function n(s: string): number {
  return parseFloat(s)
}

export function Nlr() {
  const [mode, setMode] = useState<Mode>('abs')
  const [abs, setAbs] = useState<AbsForm>(EMPTY_ABS)
  const [pct, setPct] = useState<PctForm>(EMPTY_PCT)
  const [metrics, setMetrics] = useState<NlrMetrics | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  function switchMode(m: Mode) {
    setMode(m)
    setMetrics(null)
    setError('')
  }

  // Live preview of derived absolute counts in percentage mode.
  const pctPreview = (() => {
    const wbc = n(pct.wbc), np = n(pct.neut), lp = n(pct.lymph), mp = n(pct.mono)
    if (Number.isNaN(wbc) || Number.isNaN(np) || Number.isNaN(lp)) return ''
    const neut = ((np / 100) * wbc).toFixed(2)
    const lymph = ((lp / 100) * wbc).toFixed(2)
    const mono = Number.isNaN(mp) ? '—' : ((mp / 100) * wbc).toFixed(2)
    return `Absolut dihitung: Neutrofil ${neut} · Limfosit ${lymph} · Monosit ${mono} (10³/µL)`
  })()

  function onCalc() {
    let neut: number, lymph: number, mono: number, plt: number, wbc: number | null

    if (mode === 'pct') {
      const wbcPct = n(pct.wbc), np = n(pct.neut), lp = n(pct.lymph), mp = n(pct.mono)
      if (Number.isNaN(wbcPct) || Number.isNaN(np) || Number.isNaN(lp)) {
        setError('Masukkan WBC total, Neutrofil%, dan Limfosit%')
        return
      }
      neut = (np / 100) * wbcPct
      lymph = (lp / 100) * wbcPct
      mono = Number.isNaN(mp) ? NaN : (mp / 100) * wbcPct
      plt = n(pct.plt)
      wbc = wbcPct
    } else {
      neut = n(abs.neut)
      lymph = n(abs.lymph)
      mono = n(abs.mono)
      plt = n(abs.plt)
      wbc = Number.isNaN(n(abs.wbc)) ? null : n(abs.wbc)
    }

    if (!neut || !lymph) {
      setError('Masukkan minimal neutrofil dan limfosit')
      return
    }
    setError('')
    setMetrics(computeNlr(
      neut,
      lymph,
      Number.isNaN(mono) ? undefined : mono,
      Number.isNaN(plt) ? undefined : plt,
      wbc,
    ))
    if (window.innerWidth < 769) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  const modeBtn = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => switchMode(m)}
      style={{
        flex: 1,
        padding: '8px 10px',
        borderRadius: 8,
        border: '1px solid ' + (mode === m ? 'var(--accent)' : 'var(--border)'),
        background: mode === m ? 'var(--accent)' : 'transparent',
        color: mode === m ? '#000' : 'var(--muted)',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )

  return (
    <>
      <PageHeader title="Kalkulator — NLR & Biomarker" subtitle="NLR · PLR · SII · MLR — rasio inflamasi sistemik" />

      <div className="calc-box">
        <div className="calc-title"><span>🧫</span> Rasio Inflamasi (NLR / PLR / SII / MLR)</div>

        <div style={{ display: 'flex', gap: 8, margin: '4px 0 12px' }}>
          {modeBtn('abs', 'Nilai Absolut')}
          {modeBtn('pct', 'Dari Persentase (%)')}
        </div>

        {mode === 'abs' ? (
          <div className="grid2" style={{ gap: 10 }}>
            <div>
              <div className="input-row"><label>Neutrofil absolut</label><input type="number" inputMode="decimal" placeholder="10³/µL" value={abs.neut} onChange={(e) => setAbs({ ...abs, neut: e.target.value })} /></div>
              <div className="input-row"><label>Limfosit absolut</label><input type="number" inputMode="decimal" placeholder="10³/µL" value={abs.lymph} onChange={(e) => setAbs({ ...abs, lymph: e.target.value })} /></div>
              <div className="input-row"><label>Monosit <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label><input type="number" inputMode="decimal" placeholder="10³/µL" value={abs.mono} onChange={(e) => setAbs({ ...abs, mono: e.target.value })} /></div>
            </div>
            <div>
              <div className="input-row"><label>Trombosit <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label><input type="number" inputMode="decimal" placeholder="10³/µL" value={abs.plt} onChange={(e) => setAbs({ ...abs, plt: e.target.value })} /></div>
              <div className="input-row"><label>Leukosit total <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label><input type="number" inputMode="decimal" placeholder="10³/µL" value={abs.wbc} onChange={(e) => setAbs({ ...abs, wbc: e.target.value })} /></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid2" style={{ gap: 10 }}>
              <div>
                <div className="input-row"><label>Leukosit total (WBC)</label><input type="number" inputMode="decimal" placeholder="10³/µL" value={pct.wbc} onChange={(e) => setPct({ ...pct, wbc: e.target.value })} /></div>
                <div className="input-row"><label>Neutrofil %</label><input type="number" inputMode="decimal" placeholder="%" value={pct.neut} onChange={(e) => setPct({ ...pct, neut: e.target.value })} /></div>
                <div className="input-row"><label>Limfosit %</label><input type="number" inputMode="decimal" placeholder="%" value={pct.lymph} onChange={(e) => setPct({ ...pct, lymph: e.target.value })} /></div>
              </div>
              <div>
                <div className="input-row"><label>Monosit % <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label><input type="number" inputMode="decimal" placeholder="%" value={pct.mono} onChange={(e) => setPct({ ...pct, mono: e.target.value })} /></div>
                <div className="input-row"><label>Trombosit <span style={{ fontSize: 10, color: 'var(--muted)' }}>(absolut, opsional)</span></label><input type="number" inputMode="decimal" placeholder="10³/µL" value={pct.plt} onChange={(e) => setPct({ ...pct, plt: e.target.value })} /></div>
              </div>
            </div>
            {pctPreview && <div className="formula-note" style={{ marginTop: 4 }}>{pctPreview}</div>}
          </>
        )}

        <button className="calc-btn" onClick={onCalc}>Hitung Rasio Inflamasi</button>
        {error && <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>{error}</div>}

        {metrics && (
          <div ref={resultRef} style={{ marginTop: 16 }}>
            <div className="result-grid">
              {metrics.cards.map((c) => (
                <div className="result-card" key={c.label} style={{ borderColor: c.color }}>
                  <div className="result-label">{c.label}</div>
                  <div className="result-value" style={{ color: c.color }}>{c.value}</div>
                  <div className="result-sub">{c.sub}</div>
                </div>
              ))}
            </div>

            <div className={'cc ' + metrics.nlrCls} style={{ marginTop: 10 }}>
              <div className="ct">Interpretasi NLR: {metrics.nlr.toFixed(2)}</div>
              <p>{metrics.nlrInterp}</p>
            </div>

            <div className="subsec" style={{ marginTop: 12 }}>Interpretasi per Konteks Klinis</div>
            <table>
              <tbody>
                <tr><th>Kondisi</th><th>NLR Cut-off</th><th>Signifikansi</th></tr>
                <tr><td>Sepsis / Infeksi berat</td><td>&gt;5–7</td><td>Prediktor outcome buruk, mortalitas 28-hari meningkat</td></tr>
                <tr><td>COVID-19</td><td>&gt;3.13</td><td>Prediksi ICU admission (Sen 77%, Spes 79%)</td></tr>
                <tr><td>Pneumonia (CAP)</td><td>&gt;5</td><td>Berkorelasi dengan CURB-65 ≥3 dan mortalitas</td></tr>
                <tr><td>Infark Miokard Akut</td><td>&gt;3.4</td><td>Prediktor mortalitas jangka panjang</td></tr>
                <tr><td>Post-operasi</td><td>&gt;5 (hari ke-1)</td><td>Risiko komplikasi infeksi post-op meningkat</td></tr>
                <tr><td>Keganasan (onkologi)</td><td>&gt;3–5</td><td>Prognostik negatif pada berbagai jenis kanker</td></tr>
              </tbody>
            </table>

            {metrics.wbcNote && (
              <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>
                <strong>⚠ Periksa Input</strong> {metrics.wbcNote}
              </div>
            )}
            <div className="formula-note" style={{ marginTop: 8 }}>
              NLR = Neutrofil/Limfosit · PLR = Trombosit/Limfosit · SII = (Neutrofil×Trombosit)/Limfosit · MLR = Monosit/Limfosit<br />
              Input harus berupa nilai <strong>absolut</strong> (10³/μL), bukan persentase. &nbsp;|&nbsp; Zahorec R. Bratisl Lek Listy 2001 · Hu B. J Cancer 2014;5:442
            </div>
          </div>
        )}
      </div>
    </>
  )
}

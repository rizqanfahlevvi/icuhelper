import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { usePatientStore } from '../store/patient'
import {
  CATEGORY_LABELS, DRUG_NAMES, PUMP_CATEGORIES, PUMP_INFO,
  computePump, type PumpResult,
} from '../lib/pump'

export function Pump() {
  const session = usePatientStore((s) => s.session)
  const patch = usePatientStore((s) => s.patch)

  const [category, setCategory] = useState('sedasi')
  const [drugKey, setDrugKey] = useState(PUMP_CATEGORIES['sedasi'][0][0])
  const [bb, setBb] = useState('')
  const [dose, setDose] = useState('')
  const [vol, setVol] = useState('50')
  const [result, setResult] = useState<PumpResult | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  // Autofill weight from shared patient context.
  useEffect(() => {
    if (session.beratBadan != null) setBb(String(session.beratBadan))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onCategory(cat: string) {
    setCategory(cat)
    const first = PUMP_CATEGORIES[cat][0][0]
    setDrugKey(first)
    setResult(null)
  }

  function onCalc() {
    const bbN = parseFloat(bb)
    const doseN = parseFloat(dose)
    const volN = parseFloat(vol) || 50
    if (!bbN || !doseN) {
      setError('Masukkan BB dan dosis target')
      return
    }
    setError('')
    patch({ beratBadan: bbN })
    setResult(computePump(bbN, drugKey, doseN, volN))
    if (window.innerWidth < 769) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  const drug = PUMP_INFO[drugKey]
  const options = PUMP_CATEGORIES[category]

  return (
    <>
      <PageHeader title="Kalkulator — Syringe Pump" subtitle="Rate mL/jam · durasi syringe · database obat ICU" />

      <div className="calc-box">
        <div className="calc-title"><span>🔬</span> Kalkulator Rate Syringe Pump</div>
        <div className="grid2" style={{ gap: 10 }}>
          <div>
            <div className="input-row">
              <label>Kategori</label>
              <select value={category} onChange={(e) => onCategory(e.target.value)}>
                {CATEGORY_LABELS.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="input-row">
              <label>Obat</label>
              <select value={drugKey} onChange={(e) => { setDrugKey(e.target.value); setResult(null) }}>
                {options.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="input-row">
              <label>Berat badan</label>
              <input type="number" inputMode="decimal" placeholder="kg" value={bb} onChange={(e) => setBb(e.target.value)} />
              <span className="unit">kg</span>
            </div>
            <div className="input-row">
              <label>Dosis target</label>
              <input type="number" inputMode="decimal" placeholder="dosis" value={dose} onChange={(e) => setDose(e.target.value)} />
              <span className="unit">{drug.unit}</span>
            </div>
            <div className="input-row">
              <label>Volume syringe</label>
              <input type="number" inputMode="decimal" placeholder="50" value={vol} onChange={(e) => setVol(e.target.value)} />
              <span className="unit">mL</span>
            </div>
          </div>
          <div>
            <div className="info" style={{ marginTop: 4 }}>
              <strong>{DRUG_NAMES[drugKey] || drugKey}:</strong><br />
              {drug.info}
            </div>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalc}>Hitung Rate Pump</button>
        {error && <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>{error}</div>}

        {result && (
          <div ref={resultRef} style={{ marginTop: 16 }}>
            <div className="pump-result">
              <div className="plabel">Rate Syringe Pump — {result.dname}</div>
              <div className="pval">{result.rateMlH.toFixed(2)} mL/jam</div>
              <div className="psub">
                Dosis: {result.dose} {result.unit}{result.isFlatDose ? '' : ` · BB: ${result.bb} kg`} · Syringe: {result.vol} mL
              </div>
            </div>
            <div className="result-grid" style={{ marginTop: 10 }}>
              <div className="result-card"><div className="result-label">Rate</div><div className="result-value">{result.rateMlH.toFixed(2)}</div><div className="result-sub">mL/jam</div></div>
              <div className="result-card"><div className="result-label">Durasi Syringe</div><div className="result-value">{result.duration.toFixed(1)}</div><div className="result-sub">jam ({result.vol} mL)</div></div>
              <div className="result-card"><div className="result-label">Dosis Aktual</div><div className="result-value">{result.dose}</div><div className="result-sub">{result.unit}</div></div>
            </div>
            <div className="formula-note" style={{ marginTop: 8 }}>{result.info}</div>

            {result.drugKey === 'furosemide' && (
              <div className="warn" style={{ marginTop: 8, fontSize: 12 }}>
                <strong>⚠ Monitoring Furosemide Drip:</strong> Cek K⁺ dan kreatinin tiap 6–8 jam · Target UO 0.5–1 mL/kg/jam · Kurangi dosis jika oliguria persisten atau K &lt;3.5 mEq/L
              </div>
            )}
            {result.drugKey === 'vasopressin' && (
              <div className="info" style={{ marginTop: 8, fontSize: 12 }}>
                <strong>Vasopressin pada Septic Shock:</strong> Dosis tetap 0.03 units/mnt — tidak dititrasi seperti NE. Tambahkan ke NE, bukan gantikan. SSC 2024.
              </div>
            )}
            {result.drugKey === 'phenylephrine' && (
              <div className="info" style={{ marginTop: 8, fontSize: 12 }}>
                <strong>Phenylephrine — Pure α1-agonis:</strong> Tidak ada efek β → tidak meningkatkan HR. Dapat menyebabkan <em>refleks bradikardia</em>. Keunggulan vs norepinefrin pada pasien dengan takikardia (AF rapid ventricular response, HOCM). Hindari pada disfungsi miokard atau curah jantung rendah karena meningkatkan afterload tanpa kompensasi inotrop. Referensi: SCCM Vasopressor Guidelines 2023.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { usePatientStore } from '../store/patient'
import { computeIbw, type Condition, type IbwResult, type Sex } from '../lib/ibw'

interface FormState {
  sex: Sex
  height: string
  actualBW: string
  condition: Condition
  age: string
  hb: string
}

function ResultCard({
  label, value, sub, valueColor, borderColor,
}: {
  label: string
  value: string
  sub: string
  valueColor?: string
  borderColor?: string
}) {
  return (
    <div className="result-card" style={borderColor ? { borderColor } : undefined}>
      <div className="result-label">{label}</div>
      <div className="result-value" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
      <div className="result-sub">{sub}</div>
    </div>
  )
}

export function Ibw() {
  const session = usePatientStore((s) => s.session)
  const patch = usePatientStore((s) => s.patch)
  const clear = usePatientStore((s) => s.clear)

  const [form, setForm] = useState<FormState>({
    sex: 'm', height: '', actualBW: '', condition: 'normal', age: '', hb: '',
  })
  const [result, setResult] = useState<IbwResult | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  // Autofill from shared patient context on first mount.
  useEffect(() => {
    setForm((f) => ({
      ...f,
      height: session.tinggiBadan != null ? String(session.tinggiBadan) : f.height,
      actualBW: session.beratBadan != null ? String(session.beratBadan) : f.actualBW,
      age: session.usia != null ? String(session.usia) : f.age,
      sex: session.jenisKelamin ?? f.sex,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = (patchForm: Partial<FormState>) =>
    setForm((f) => ({ ...f, ...patchForm }))

  function onCalc() {
    const height = parseFloat(form.height)
    if (!height) {
      setError('Masukkan tinggi badan')
      return
    }
    setError('')
    const actualBW = parseFloat(form.actualBW)
    const age = parseFloat(form.age)
    const hb = parseFloat(form.hb)

    // Write inputs back into the shared patient context.
    patch({
      jenisKelamin: form.sex,
      tinggiBadan: height,
      beratBadan: Number.isNaN(actualBW) ? undefined : actualBW,
      usia: Number.isNaN(age) ? undefined : age,
    })

    const res = computeIbw({
      sex: form.sex,
      height,
      actualBW: Number.isNaN(actualBW) ? undefined : actualBW,
      condition: form.condition,
      age: Number.isNaN(age) ? undefined : age,
      hb: Number.isNaN(hb) ? undefined : hb,
    })
    setResult(res)

    if (window.innerWidth < 769) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  const hasSession = session.tinggiBadan != null || session.beratBadan != null || session.usia != null

  return (
    <>
      <PageHeader title="Kalkulator — IBW & Ventilator" subtitle="Formula Devine · VT lung-protective · Antropometri & dosis obat" />

      {hasSession && (
        <div className="patient-session-bar">
          <span>👤 Konteks pasien:</span>
          {session.tinggiBadan != null && <span>TB {session.tinggiBadan} cm</span>}
          {session.beratBadan != null && <span>· BB {session.beratBadan} kg</span>}
          {session.usia != null && <span>· {session.usia} th</span>}
          <button className="psb-clear" onClick={() => clear()}>Hapus</button>
        </div>
      )}

      <div className="calc-box">
        <div className="calc-title"><span>⚖️</span> Kalkulator IBW &amp; Parameter Awal Ventilator</div>
        <div className="grid2" style={{ gap: 10 }}>
          <div>
            <div className="input-row">
              <label>Jenis kelamin</label>
              <select value={form.sex} onChange={(e) => update({ sex: e.target.value as Sex })}>
                <option value="m">Laki-laki</option>
                <option value="f">Perempuan</option>
              </select>
            </div>
            <div className="input-row">
              <label>Tinggi badan</label>
              <input type="number" inputMode="decimal" placeholder="cth: 165" min={100} max={220}
                value={form.height} onChange={(e) => update({ height: e.target.value })} />
              <span className="unit">cm</span>
            </div>
            <div className="input-row">
              <label>Berat badan aktual</label>
              <input type="number" inputMode="decimal" placeholder="cth: 70" min={20} max={250}
                value={form.actualBW} onChange={(e) => update({ actualBW: e.target.value })} />
              <span className="unit">kg</span>
            </div>
            <div className="input-row">
              <label>Usia</label>
              <input type="number" inputMode="decimal" placeholder="cth: 45" min={15} max={120}
                value={form.age} onChange={(e) => update({ age: e.target.value })} />
              <span className="unit">tahun</span>
            </div>
            <div className="input-row">
              <label>Kondisi klinis</label>
              <select value={form.condition} onChange={(e) => update({ condition: e.target.value as Condition })}>
                <option value="normal">Umum / Post-op</option>
                <option value="ards">ARDS</option>
                <option value="copd">PPOK</option>
                <option value="asthma">Asma Berat</option>
                <option value="neuro">Neuromuskular (GBS/MG)</option>
              </select>
            </div>
            <div className="input-row">
              <label>Hb aktual <span style={{ fontSize: 10, color: 'var(--muted)' }}>(opsional)</span></label>
              <input type="number" inputMode="decimal" placeholder="opsional, untuk MABL" step={0.1} min={0}
                value={form.hb} onChange={(e) => update({ hb: e.target.value })} />
              <span className="unit">g/dL</span>
            </div>
          </div>
          <div>
            <div className="info" style={{ marginTop: 4 }}>
              <strong>Formula Devine (IBW):</strong><br />
              Laki-laki: 50 + 0.91 × (TB cm − 152.4)<br />
              Perempuan: 45.5 + 0.91 × (TB cm − 152.4)<br />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Devine BJ. Drug Intell Clin Pharm 1974</span>
            </div>
          </div>
        </div>
        <button className="calc-btn" onClick={onCalc}>Hitung IBW &amp; Parameter</button>
        {error && <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>{error}</div>}

        {result && (
          <div ref={resultRef} style={{ marginTop: 16 }}>
            <Results result={result} actualBWRaw={parseFloat(form.actualBW)} sex={form.sex} height={parseFloat(form.height)} />
          </div>
        )}
      </div>
    </>
  )
}

function Results({ result, actualBWRaw, sex, height }: {
  result: IbwResult
  actualBWRaw: number
  sex: Sex
  height: number
}) {
  const { actual, nutrition, blood } = result
  return (
    <>
      <div className="result-grid">
        <ResultCard label="IBW" value={`${result.ibwR.toFixed(1)} kg`} sub="Devine formula — dasar VT" />
        <ResultCard label={`VT Rendah (${result.vtLow} mL/kg)`} value={`${result.vtLowML} mL`} sub="Target awal" />
        <ResultCard label={`VT Tinggi (${result.vtHigh} mL/kg)`} value={`${result.vtHighML} mL`} sub="Batas atas" />
        <ResultCard label="MV Estimasi" value={`${result.mv.toFixed(1)} L/mnt`} sub="RR 16, VT rendah" />
        {actual && (
          <ResultCard label="VT Jika Actual BW" value={`${actual.vtActLow} mL`} sub={`↑${actual.diffPct}% vs IBW — risiko overdistensi`} valueColor="var(--red)" />
        )}
        {actual?.adjBW != null && (
          <ResultCard label={`AdjBW — Obesitas (BMI ${actual.bmi.toFixed(1)})`} value={`${actual.adjBW.toFixed(1)} kg`} sub="IBW + 0.4×(ABW−IBW) · dosis obat" valueColor="var(--amber)" borderColor="var(--amber)" />
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="subsec">Rekomendasi Setting Awal — {result.condition.toUpperCase()}</div>
        <table>
          <tbody>
            <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>
            {result.ventRows.map((r) => (
              <tr key={r.param}><td>{r.param}</td><td>{r.value}</td><td>{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="formula-note" style={{ marginTop: 10 }}>
        <strong>Catatan:</strong> {result.vtNote} · IBW = {result.ibwR.toFixed(1)} kg
        ({sex === 'm' ? 'Laki-laki' : 'Perempuan'}, TB {height} cm) · Formula Devine BJ 1974
      </div>

      {actual?.adjBW != null && (
        <div className="warn" style={{ marginTop: 10, marginBottom: 0 }}>
          <strong>⚠ BMI {actual.bmi.toFixed(1)} — Pasien Obesitas: Perhatikan Pilihan Berat Badan</strong><br />
          <strong>AdjBW = IBW + 0.4 × (ABW − IBW) = {actual.adjBW.toFixed(1)} kg</strong>
          <table style={{ marginTop: 6, fontSize: 12 }}>
            <tbody>
              <tr><th>Tujuan</th><th>Gunakan</th><th>Nilai</th></tr>
              <tr><td>VT Ventilator</td><td><strong>IBW</strong></td><td>{result.ibwR.toFixed(1)} kg</td></tr>
              <tr><td>Aminoglikosida, Heparin berat-badan</td><td><strong>AdjBW</strong></td><td>{actual.adjBW.toFixed(1)} kg</td></tr>
              <tr><td>Vancomycin loading</td><td><strong>Actual BW</strong></td><td>{actualBWRaw} kg</td></tr>
              <tr><td>LMWH (enoxaparin) obesitas</td><td><strong>AdjBW</strong></td><td>{actual.adjBW.toFixed(1)} kg</td></tr>
              <tr><td>Kebutuhan kalori ICU fase akut</td><td><strong>IBW atau AdjBW</strong></td><td>ESPEN 2023: hindari overfeeding</td></tr>
            </tbody>
          </table>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>ESPEN Guidelines 2023 · ASPEN 2022 · Rice TW. Crit Care Med 2012</span>
        </div>
      )}

      {actual && (
        <>
          <div className="subsec" style={{ marginTop: 14 }}>Anthropometri &amp; Parameter Klinis Lanjutan</div>
          <div className="result-grid">
            <ResultCard label="BMI" value={actual.bmi.toFixed(1)} sub={`kg/m² — ${actual.bmiLabel}`} valueColor={actual.bmiColor} borderColor={actual.bmiColor} />
            <ResultCard label="BSA (Mosteller)" value={actual.bsa.toFixed(2)} sub="m² — dosis kemoterapi" />
            <ResultCard label="LBW (Janmahasatian)" value={actual.lbw.toFixed(1)} sub="kg — propofol/rocuronium" />
            <ResultCard label="EBV" value={actual.ebvL.toFixed(2)} sub={`L (${sex === 'm' ? 70 : 65} mL/kg)`} />
            {actual.abw != null && (
              <ResultCard label="ABW (Obesitas)" value={actual.abw.toFixed(1)} sub="kg — aminoglikosida/heparin" valueColor="var(--amber)" borderColor="var(--amber)" />
            )}
          </div>

          {nutrition && (
            <div className="result-grid" style={{ marginTop: 8 }}>
              <ResultCard label="REE (Harris-Benedict)" value={String(nutrition.ree)} sub="kcal/hari (istirahat)" />
              <ResultCard label="Target ICU (25–30 kcal/kg)" value={`${nutrition.calMin}–${nutrition.calMax}`} sub="kcal/hari (fase akut)" />
              <ResultCard label="Target Protein ICU" value={`${nutrition.protMin}–${nutrition.protMax}`} sub="g/hari (1.2–2.0 g/kg)" />
            </div>
          )}

          {blood?.type === 'mabl' && blood.mabl != null && (
            <div className="formula-note" style={{ marginTop: 8 }}>
              <strong>MABL (Max Allowable Blood Loss):</strong> EBV {actual.ebvL.toFixed(2)} L × (Hb {blood.hb} − trigger 7) / Hb {blood.hb} = <strong>{blood.mabl.toFixed(0)} mL</strong><br />
              Perdarahan &gt;{blood.mabl.toFixed(0)} mL → pertimbangkan transfusi PRC. Pre-operatif: evaluasi autologous donation atau cell saver.
            </div>
          )}
          {blood?.type === 'low' && (
            <div className="warn" style={{ marginTop: 8, marginBottom: 0 }}>
              <strong>⚠ Hb di Bawah Trigger Transfusi</strong> Hb {blood.hb} g/dL &lt; 7 g/dL — pertimbangkan transfusi PRC.
              Estimasi kebutuhan PRC: ±{blood.prcKolf} kolf. Gunakan tab 🩸 Transfusi untuk kalkulasi lengkap.
            </div>
          )}

          <div className="subsec" style={{ marginTop: 14 }}>Panduan Pilihan BB untuk Dosis Obat</div>
          <table>
            <tbody>
              <tr><th>Obat / Kategori</th><th>BB yang Digunakan</th><th>Nilai</th><th>Alasan</th></tr>
              <tr><td>VT Ventilator</td><td>IBW</td><td>{result.ibwR.toFixed(1)} kg</td><td>Volume paru bergantung TB, bukan massa</td></tr>
              <tr>
                <td>Aminoglikosida ({actual.bmi >= 30 ? 'obesitas' : 'BMI normal'})</td>
                <td>{actual.bmi >= 30 ? 'ABW' : 'IBW'}</td>
                <td>{actual.bmi >= 30 ? (actual.abw != null ? `${actual.abw.toFixed(1)} kg` : '-') : `${result.ibwR.toFixed(1)} kg`}</td>
                <td>{actual.bmi >= 30 ? 'ABW mencerminkan distribusi aminoglikosida pada jaringan lemak' : 'BMI normal: gunakan IBW atau actual'}</td>
              </tr>
              <tr><td>Propofol induction / Rocuronium</td><td>LBW</td><td>{actual.lbw.toFixed(1)} kg</td><td>Distribusi ke lean tissue</td></tr>
              <tr>
                <td>Heparin (APTT-guided)</td>
                <td>{actual.bmi >= 30 ? 'ABW' : 'Actual BW'}</td>
                <td>{actual.bmi >= 30 && actual.abw != null ? `${actual.abw.toFixed(1)} kg` : `${actualBWRaw} kg`}</td>
                <td>Berbasis actual atau ABW pada obesitas</td>
              </tr>
              <tr><td>Obat umum (parasetamol, ibuprofen, dll)</td><td>Actual BW</td><td>{actualBWRaw} kg</td><td>Standar dosis umum</td></tr>
              <tr><td>Kemoterapi</td><td>BSA</td><td>{actual.bsa.toFixed(2)} m²</td><td>Berdasarkan luas permukaan tubuh</td></tr>
            </tbody>
          </table>
          <div className="formula-note" style={{ marginTop: 6 }}>
            Harris JA &amp; Benedict FG 1919 · Janmahasatian S. Clin Pharmacokinet 2005;44:1051 · Mosteller RD. NEJM 1987;317:1098 · ASPEN Critical Care Guidelines 2021
          </div>
        </>
      )}
    </>
  )
}

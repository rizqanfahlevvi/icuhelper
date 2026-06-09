import { useState } from 'react'
import { calcBasal, calcKoreksi, calcCumulative, calcFluidOverload, calcFluidBalance, ROSE_DATA, type RosePhase, type VentType, type SweatLevel } from '../lib/cairan'

const ROW_STYLE: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2, var(--bg))', marginBottom: 6, fontSize: 12 }
const BOLD_ROW: React.CSSProperties = { ...ROW_STYLE, fontWeight: 700, background: 'var(--accent-subtle, var(--teal-bg))', borderColor: 'var(--accent, var(--teal))' }

function ResultRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div style={bold ? BOLD_ROW : ROW_STYLE}><span style={{ color: 'var(--muted)' }}>{label}</span><span style={{ fontWeight: bold ? 700 : 400 }}>{value}</span></div>
}

function AlertBox({ msg, color }: { msg: string; color: string }) {
  return <div style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid var(--${color})`, background: `var(--${color}-bg, var(--bg))`, fontSize: 12, lineHeight: 1.6, marginTop: 8 }} dangerouslySetInnerHTML={{ __html: msg }} />
}

const BOXES = ['Kebutuhan Basal', 'Koreksi & Total', 'Balans Kumulatif', 'Fluid Overload %', 'Balans 24 Jam'] as const

export function Cairan() {
  const [box, setBox] = useState<typeof BOXES[number]>('Kebutuhan Basal')
  const [rosePhase, setRosePhase] = useState<RosePhase | null>(null)

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px' }}>Kalkulator Cairan Harian ICU</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Kebutuhan Basal · Koreksi IWL · Balans Kumulatif · Fluid Overload · ROSE Phases</p>
      </div>

      {/* ROSE Selector */}
      <div style={{ marginBottom: 20, padding: 14, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface2, var(--bg))' }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)', marginBottom: 8 }}>Fase ROSE (opsional — mempengaruhi semua box)</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: rosePhase ? 10 : 0 }}>
          {(Object.keys(ROSE_DATA) as RosePhase[]).map(p => {
            const d = ROSE_DATA[p]
            return (
              <button key={p} onClick={() => setRosePhase(rosePhase === p ? null : p)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: rosePhase === p ? d.color : 'var(--bg)',
                color: rosePhase === p ? '#fff' : 'var(--text)',
                border: `1.5px solid ${d.color}`,
              }}>{p} — {d.label}</button>
            )
          })}
        </div>
        {rosePhase && (
          <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text)', borderLeft: `3px solid ${ROSE_DATA[rosePhase].color}`, paddingLeft: 10 }}>
            <div>{ROSE_DATA[rosePhase].desc}</div>
            <div style={{ marginTop: 4, fontWeight: 700, color: ROSE_DATA[rosePhase].color }}>📊 Target balans: {ROSE_DATA[rosePhase].target}</div>
          </div>
        )}
      </div>

      {/* Box Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {BOXES.map(b => (
          <button key={b} onClick={() => setBox(b)} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: box === b ? 'var(--accent, var(--teal))' : 'var(--surface2, var(--bg))',
            color: box === b ? '#fff' : 'var(--text)',
            border: `1.5px solid ${box === b ? 'var(--accent, var(--teal))' : 'var(--border)'}`,
          }}>{b}</button>
        ))}
      </div>

      {box === 'Kebutuhan Basal' && <BasalBox rosePhase={rosePhase} />}
      {box === 'Koreksi & Total' && <KoreksiBox rosePhase={rosePhase} />}
      {box === 'Balans Kumulatif' && <KumulatifBox />}
      {box === 'Fluid Overload %' && <FoBox />}
      {box === 'Balans 24 Jam' && <Fb24Box rosePhase={rosePhase} />}
    </div>
  )
}

function BasalBox({ rosePhase }: { rosePhase: RosePhase | null }) {
  const [bw, setBw] = useState(''); const [target, setTarget] = useState('25')
  const [res, setRes] = useState<ReturnType<typeof calcBasal> | null>(null)
  const calc = () => { const b = parseFloat(bw); if (!b) return; setRes(calcBasal(b, parseFloat(target))) }
  return (
    <div className="calc-box">
      <h3 style={{ marginBottom: 4 }}>Box 1 — Kebutuhan Basal ICU</h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Pendekatan restriksi rasional berdasarkan NICE CG174 & CLASSIC NEJM 2022</p>
      <div className="form-grid">
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bw} onChange={e => setBw(e.target.value)} /></label>
        <label>Target (mL/kg/hari)
          <select value={target} onChange={e => setTarget(e.target.value)}>
            <option value="20">20 — restriksi ketat</option>
            <option value="25">25 — standar ICU (NICE)</option>
            <option value="30">30 — liberal</option>
          </select>
        </label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung</button>
      {res && (
        <div style={{ marginTop: 14 }}>
          <ResultRow label={`Maintenance (${target} mL/kg/hari)`} value={`${Math.round(res.icuPerDay)} mL/hari`} bold />
          <ResultRow label="Rate infus IV" value={`${res.icuPerHour.toFixed(1)} mL/jam`} bold />
          <ResultRow label="Holliday-Segar (referensi)" value={`${res.hs} mL/hari`} />
          <ResultRow label="Selisih vs Holliday-Segar" value={`−${Math.round(res.hs - res.icuPerDay)} mL/hari`} />
          {rosePhase && <div style={{ marginTop: 8, fontSize: 12, borderLeft: `3px solid ${ROSE_DATA[rosePhase].color}`, paddingLeft: 10 }}>Fase <strong>{rosePhase} — {ROSE_DATA[rosePhase].label}</strong> aktif. Target balans: <strong>{ROSE_DATA[rosePhase].target}</strong></div>}
        </div>
      )}
    </div>
  )
}

function KoreksiBox({ rosePhase }: { rosePhase: RosePhase | null }) {
  const [bw, setBw] = useState(''); const [temp, setTemp] = useState('37')
  const [vent, setVent] = useState<VentType>('ventilator')
  const [sweat, setSweat] = useState<SweatLevel>('none')
  const [uoTgt, setUoTgt] = useState('0.5')
  const [ngt, setNgt] = useState(''); const [drain, setDrain] = useState(''); const [other, setOther] = useState('')
  const [target, setTarget] = useState('25')
  const [res, setRes] = useState<ReturnType<typeof calcKoreksi> | null>(null)
  const calc = () => {
    const b = parseFloat(bw)
    if (!b) return
    setRes(calcKoreksi(b, parseFloat(target), parseFloat(temp) || 37, vent, sweat, parseFloat(uoTgt) || 0.5, parseFloat(ngt) || 0, parseFloat(drain) || 0, parseFloat(other) || 0))
  }
  return (
    <div className="calc-box">
      <h3 style={{ marginBottom: 4 }}>Box 2 — Koreksi & Total Kebutuhan</h3>
      <div className="form-grid">
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bw} onChange={e => setBw(e.target.value)} /></label>
        <label>Target Basal (mL/kg/hari)
          <select value={target} onChange={e => setTarget(e.target.value)}>
            <option value="20">20</option><option value="25">25 (standar)</option><option value="30">30</option>
          </select>
        </label>
        <label>Suhu (°C)<input type="number" placeholder="37.0" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} /></label>
        <label>Status Ventilasi
          <select value={vent} onChange={e => setVent(e.target.value as VentType)}>
            <option value="ventilator">Ventilator mekanik</option>
            <option value="hfnc">HFNC</option>
            <option value="spontan">Spontan / NRM / NK</option>
          </select>
        </label>
        <label>Diaphoresis
          <select value={sweat} onChange={e => setSweat(e.target.value as SweatLevel)}>
            <option value="none">Tidak ada</option>
            <option value="mild">Ringan (+200 mL/hari)</option>
            <option value="moderate">Sedang (+500 mL/hari)</option>
            <option value="severe">Berat (+900 mL/hari)</option>
          </select>
        </label>
        <label>Target UO (mL/kg/jam)<input type="number" placeholder="0.5" step="0.1" value={uoTgt} onChange={e => setUoTgt(e.target.value)} /></label>
        <label>Output NGT (mL/hari)<input type="number" placeholder="0" value={ngt} onChange={e => setNgt(e.target.value)} /></label>
        <label>Output Drain/WSD (mL/hari)<input type="number" placeholder="0" value={drain} onChange={e => setDrain(e.target.value)} /></label>
        <label>Kehilangan lain (mL/hari)<input type="number" placeholder="0" value={other} onChange={e => setOther(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Total</button>
      {res && (
        <div style={{ marginTop: 14 }}>
          <ResultRow label="Maintenance basal ICU" value={`${Math.round(res.maintenance)} mL/hari`} />
          <ResultRow label={`IWL basal — ${vent}`} value={`${Math.round(res.iwlBase)} mL/hari`} />
          {res.tempCorr > 0 && <ResultRow label={`Koreksi demam`} value={`+${Math.round(res.tempCorr)} mL/hari`} />}
          {res.sweatCorr > 0 && <ResultRow label="Koreksi diaphoresis" value={`+${res.sweatCorr} mL/hari`} />}
          <ResultRow label="IWL total" value={`${Math.round(res.iwlTotal)} mL/hari`} />
          <ResultRow label={`Target UO (${uoTgt} mL/kg/jam)`} value={`${Math.round(res.uoDay)} mL/hari`} />
          <ResultRow label="TOTAL per hari" value={`${Math.round(res.total)} mL/hari`} bold />
          <ResultRow label="Rate IV maintenance" value={`${res.ratePerHr.toFixed(1)} mL/jam`} bold />
          <ResultRow label="Total per kgBB" value={`${res.perKgDay.toFixed(1)} mL/kg/hari`} />
          {rosePhase && <div style={{ marginTop: 8, fontSize: 12, borderLeft: `3px solid ${ROSE_DATA[rosePhase].color}`, paddingLeft: 10 }}>Fase <strong>{rosePhase}</strong> — Target: <strong>{ROSE_DATA[rosePhase].target}</strong></div>}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>⚠️ Angka ini adalah panduan awal. Evaluasi ulang tiap 12–24 jam berdasarkan status hemodinamik, balans harian, dan fase ROSE. Tidak termasuk cairan untuk obat-obatan dan nutrisi parenteral.</div>
        </div>
      )}
    </div>
  )
}

function KumulatifBox() {
  const [days, setDays] = useState<string[]>(Array(7).fill(''))
  const [res, setRes] = useState<ReturnType<typeof calcCumulative> | null>(null)
  const calc = () => {
    const vals = days.map(d => d === '' ? null : parseFloat(d))
    if (vals.every(v => v == null)) return
    setRes(calcCumulative(vals))
  }
  const cumL = res ? (res[res.length - 1]?.cumulative ?? 0) / 1000 : 0
  const cumColor = cumL > 5 ? 'red' : cumL > 2 ? 'amber' : cumL >= 0 ? 'green' : 'blue'

  return (
    <div className="calc-box">
      <h3 style={{ marginBottom: 4 }}>Box 3 — Balans Kumulatif</h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Masukkan balans harian (+ positif / − negatif) dalam mL</p>
      <div className="form-grid">
        {days.map((d, i) => (
          <label key={i}>Hari {i + 1} (mL)<input type="number" placeholder="mis. +500" value={d} onChange={e => setDays(prev => { const n = [...prev]; n[i] = e.target.value; return n })} /></label>
        ))}
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Kumulatif</button>
      {res && res.length > 0 && (
        <div style={{ marginTop: 14 }}>
          {res.map(r => (
            <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2, var(--bg))', marginBottom: 5, fontSize: 12 }}>
              <span style={{ color: 'var(--muted)' }}>Hari {r.day}</span>
              <span>
                <span>{r.balance >= 0 ? '+' : ''}{r.balance.toLocaleString('id-ID')} mL</span>
                <span style={{ color: 'var(--muted)', margin: '0 6px' }}>·</span>
                <strong style={{ color: `var(--${r.cumulative > 5000 ? 'red' : r.cumulative > 2000 ? 'amber' : r.cumulative >= 0 ? 'text' : 'blue'})` }}>Kum: {r.cumulative >= 0 ? '+' : ''}{r.cumulative.toLocaleString('id-ID')} mL</strong>
              </span>
            </div>
          ))}
          <ResultRow label="Total kumulatif" value={`${res[res.length - 1].cumulative >= 0 ? '+' : ''}${res[res.length - 1].cumulative.toLocaleString('id-ID')} mL`} bold />
          <AlertBox color={cumColor} msg={
            cumL > 10 ? `<strong>Kumulatif Berat ≥10 L</strong> — Intervensi aktif segera: furosemid IV kontinu, pertimbangkan CRRT.`
            : cumL > 5 ? `<strong>Kumulatif Tinggi (5–10 L)</strong> — Risiko disfungsi organ. Target active de-resuscitation (fase E).`
            : cumL > 2 ? `<strong>Kumulatif Sedang (2–5 L)</strong> — Pertimbangkan fase Evacuation jika hemodinamik stabil.`
            : `<strong>Kumulatif dalam batas</strong> — Pertahankan monitoring ketat.`
          } />
        </div>
      )}
    </div>
  )
}

function FoBox() {
  const [dry, setDry] = useState(''); const [current, setCurrent] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcFluidOverload> | null>(null)
  const calc = () => { const d = parseFloat(dry), c = parseFloat(current); if (!d || !c) return; setRes(calcFluidOverload(d, c)) }
  return (
    <div className="calc-box">
      <h3 style={{ marginBottom: 4 }}>Box 4 — Fluid Overload %</h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Berdasarkan perubahan berat badan dari baseline kering</p>
      <div className="form-grid">
        <label>BB Kering / Baseline (kg)<input type="number" placeholder="60" step="0.1" value={dry} onChange={e => setDry(e.target.value)} /></label>
        <label>BB Saat Ini (kg)<input type="number" placeholder="65" step="0.1" value={current} onChange={e => setCurrent(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung FO%</button>
      {res && (
        <div style={{ marginTop: 14 }}>
          <ResultRow label="Selisih BB" value={`${res.diffKg >= 0 ? '+' : ''}${res.diffKg.toFixed(1)} kg`} />
          <ResultRow label="Estimasi volume berlebih" value={`${res.diffMl >= 0 ? '+' : ''}${Math.round(res.diffMl)} mL`} />
          <ResultRow label="Fluid Overload %" value={`${res.foPercent >= 0 ? '+' : ''}${res.foPercent.toFixed(1)}%`} bold />
          <AlertBox color={res.color} msg={`<strong>${res.label}</strong><br>${res.msg}<div style="margin-top:6px;font-size:11px;font-weight:600">${res.roseHint}</div>`} />
        </div>
      )}
    </div>
  )
}

function Fb24Box({ rosePhase }: { rosePhase: RosePhase | null }) {
  const [inputs, setInputs] = useState({ iv: '', med: '', nutri: '', bolus: '', oral: '' })
  const [outputs, setOutputs] = useState({ uo: '', iwl: '', ngt: '', drain: '', other: '' })
  const [res, setRes] = useState<ReturnType<typeof calcFluidBalance> | null>(null)
  const n = (v: string) => parseFloat(v) || 0
  const calc = () => {
    setRes(calcFluidBalance(
      [n(inputs.iv), n(inputs.med), n(inputs.nutri), n(inputs.bolus), n(inputs.oral)],
      [n(outputs.uo), n(outputs.iwl), n(outputs.ngt), n(outputs.drain), n(outputs.other)]
    ))
  }
  return (
    <div className="calc-box">
      <h3 style={{ marginBottom: 4 }}>Box 5 — Fluid Balance 24 Jam</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', marginBottom: 8, textTransform: 'uppercase' }}>Input</div>
          {[['iv', 'Cairan IV maintenance (mL)'], ['med', 'Cairan obat-obatan (mL)'], ['nutri', 'Nutrisi (EN/PN) (mL)'], ['bolus', 'Bolus/loading (mL)'], ['oral', 'Per oral (mL)']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', fontSize: 12, marginBottom: 8 }}>
              {label}<input type="number" placeholder="0" value={inputs[k as keyof typeof inputs]} onChange={e => setInputs(p => ({ ...p, [k]: e.target.value }))} style={{ marginTop: 4 }} />
            </label>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 8, textTransform: 'uppercase' }}>Output</div>
          {[['uo', 'Urine output (mL)'], ['iwl', 'IWL estimasi (mL)'], ['ngt', 'Output NGT (mL)'], ['drain', 'Output drain (mL)'], ['other', 'Kehilangan lain (mL)']].map(([k, label]) => (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', fontSize: 12, marginBottom: 8 }}>
              {label}<input type="number" placeholder="0" value={outputs[k as keyof typeof outputs]} onChange={e => setOutputs(p => ({ ...p, [k]: e.target.value }))} style={{ marginTop: 4 }} />
            </label>
          ))}
        </div>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Balance</button>
      {res && (
        <div style={{ marginTop: 14 }}>
          <ResultRow label="Total Input" value={`${Math.round(res.totalIn)} mL`} />
          <ResultRow label="Total Output" value={`${Math.round(res.totalOut)} mL`} />
          <ResultRow label="BALANCE 24 JAM" value={`${res.balance >= 0 ? '+' : ''}${Math.round(res.balance)} mL`} bold />
          <AlertBox color={res.color} msg={`<strong>${res.label}</strong><br>${res.msg}`} />
          {rosePhase && (
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, border: `1px solid ${ROSE_DATA[rosePhase].color}`, fontSize: 11 }}>
              Fase <strong>{rosePhase} — {ROSE_DATA[rosePhase].label}</strong> · Target: <strong>{ROSE_DATA[rosePhase].target}</strong><br />
              {res.balance >= ROSE_DATA[rosePhase].targetMin && res.balance <= ROSE_DATA[rosePhase].targetMax
                ? <span style={{ color: ROSE_DATA[rosePhase].color }}>✓ Balans hari ini sesuai target fase.</span>
                : <span style={{ color: 'var(--red)' }}>✗ Balans di luar target fase. Evaluasi manajemen cairan.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

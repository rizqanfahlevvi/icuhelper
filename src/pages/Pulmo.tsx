import { useState } from 'react'
import { calcCurb65, calcPsi, calcSmartCop, calcAaGradient } from '../lib/pulmo'

const TABS = ['CURB-65', 'PSI/PORT', 'SMART-COP', 'A-a Gradient'] as const
type Tab = typeof TABS[number]

function Curb65Panel() {
  const [conf, setConf] = useState(false)
  const [ureum, setUreum] = useState(''); const [rr, setRr] = useState(''); const [sbp, setSbp] = useState(''); const [dbp, setDbp] = useState(''); const [age, setAge] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcCurb65> | null>(null)
  const calc = () => {
    setRes(calcCurb65(conf, ureum ? parseFloat(ureum) : undefined, rr ? parseFloat(rr) : undefined, sbp ? parseFloat(sbp) : undefined, dbp ? parseFloat(dbp) : undefined, age ? parseFloat(age) : undefined))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Community-Acquired Pneumonia severity · Lim WS et al. Thorax 2003</p>
      <div className="form-grid">
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={conf} onChange={e => setConf(e.target.checked)} />
          C — Confusion (disorientasi baru)
        </label>
        <label>U — Ureum (mg/dL)<input type="number" placeholder="mis. 50" value={ureum} onChange={e => setUreum(e.target.value)} /></label>
        <label>R — RR (/mnt)<input type="number" placeholder="mis. 28" value={rr} onChange={e => setRr(e.target.value)} /></label>
        <label>B — Sistolik (mmHg)<input type="number" placeholder="mis. 100" value={sbp} onChange={e => setSbp(e.target.value)} /></label>
        <label>Diastolik (mmHg)<input type="number" placeholder="mis. 70" value={dbp} onChange={e => setDbp(e.target.value)} /></label>
        <label>65 — Usia (thn)<input type="number" placeholder="mis. 70" value={age} onChange={e => setAge(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung CURB-65</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: `var(--${res.color})` }}>{res.score}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: `var(--${res.color})`, marginTop: 4 }}>CURB-65 — {res.interp} · Mortalitas 30-hari {res.mort}</div>
          </div>
          {res.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, border: '1px solid var(--border)', marginBottom: 5, background: 'var(--surface2, var(--bg))' }}>
              <div style={{ flex: 1, fontSize: 12 }}><strong style={{ display: 'block' }}>{item.name}</strong><small style={{ color: 'var(--muted)' }}>{item.detail}</small></div>
              <div style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'right', color: item.pts > 0 ? 'var(--red)' : item.detail.includes('Tidak dimasukkan') ? 'var(--muted)' : 'var(--teal)' }}>{item.detail.includes('Tidak dimasukkan') ? '—' : item.pts}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: `var(--${res.color}-bg, var(--bg))`, border: `1px solid var(--${res.color})`, fontSize: 13, lineHeight: 1.6 }}>{res.action}</div>
        </div>
      )}
    </div>
  )
}

function PsiPanel() {
  const [sex, setSex] = useState<'m' | 'f'>('m'); const [age, setAge] = useState('')
  const [nursing, setNursing] = useState(false); const [neo, setNeo] = useState(false); const [liver, setLiver] = useState(false)
  const [chf, setChf] = useState(false); const [cva, setCva] = useState(false); const [renal, setRenal] = useState(false); const [ms, setMs] = useState(false)
  const [rr, setRr] = useState(''); const [sbp, setSbp] = useState(''); const [temp, setTemp] = useState(''); const [hr, setHr] = useState('')
  const [ph, setPh] = useState(''); const [ureum, setUreum] = useState(''); const [na, setNa] = useState(''); const [glu, setGlu] = useState('')
  const [hct, setHct] = useState(''); const [pao2, setPao2] = useState(''); const [spo2, setSpo2] = useState(''); const [effusion, setEffusion] = useState(false)
  const [res, setRes] = useState<ReturnType<typeof calcPsi> | null>(null)
  const n = (v: string) => v ? parseFloat(v) : undefined
  const calc = () => {
    if (!age) return
    setRes(calcPsi(sex, parseFloat(age), nursing ? 10 : 0, neo ? 30 : 0, liver ? 20 : 0, chf ? 10 : 0, cva ? 10 : 0, renal ? 10 : 0, ms ? 10 : 0, n(rr), n(sbp), n(temp), n(hr), n(ph), n(ureum), n(na), n(glu), n(hct), n(pao2), n(spo2), effusion ? 10 : 0))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Pneumonia Severity Index / PORT Score · Fine MJ et al. NEJM 1997</p>
      <div className="form-grid">
        <label>Jenis Kelamin<select value={sex} onChange={e => setSex(e.target.value as 'm' | 'f')}><option value="m">Laki-laki</option><option value="f">Perempuan (usia −10)</option></select></label>
        <label>Usia (thn)<input type="number" placeholder="60" value={age} onChange={e => setAge(e.target.value)} /></label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Komorbiditas</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[['nursing', nursing, setNursing, 'Nursing home (+10)'], ['neo', neo, setNeo, 'Keganasan (+30)'], ['liver', liver, setLiver, 'Penyakit liver (+20)'], ['chf', chf, setChf, 'Gagal jantung (+10)'], ['cva', cva, setCva, 'Stroke/CVA (+10)'], ['renal', renal, setRenal, 'Penyakit ginjal (+10)'], ['ms', ms, setMs, 'Alt. status mental (+20)']].map(([k, val, setter, label]) => (
            <label key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '4px 10px', borderRadius: 6, border: `1px solid ${val ? 'var(--red)' : 'var(--border)'}`, background: val ? 'var(--red-bg, #fff5f5)' : 'var(--bg)', cursor: 'pointer' }}>
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} />
              {label as string}
            </label>
          ))}
        </div>
      </div>
      <div className="form-grid">
        <label>RR (/mnt)<input type="number" placeholder="18" value={rr} onChange={e => setRr(e.target.value)} /></label>
        <label>Sistolik (mmHg)<input type="number" placeholder="120" value={sbp} onChange={e => setSbp(e.target.value)} /></label>
        <label>Suhu (°C)<input type="number" placeholder="37.0" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} /></label>
        <label>Nadi (bpm)<input type="number" placeholder="80" value={hr} onChange={e => setHr(e.target.value)} /></label>
        <label>pH<input type="number" placeholder="7.40" step="0.01" value={ph} onChange={e => setPh(e.target.value)} /></label>
        <label>Ureum (mg/dL)<input type="number" placeholder="30" value={ureum} onChange={e => setUreum(e.target.value)} /></label>
        <label>Na (mEq/L)<input type="number" placeholder="140" value={na} onChange={e => setNa(e.target.value)} /></label>
        <label>Glukosa (mg/dL)<input type="number" placeholder="100" value={glu} onChange={e => setGlu(e.target.value)} /></label>
        <label>Hematokrit (%)<input type="number" placeholder="40" value={hct} onChange={e => setHct(e.target.value)} /></label>
        <label>PaO₂ (mmHg)<input type="number" placeholder="75" value={pao2} onChange={e => setPao2(e.target.value)} /></label>
        <label>SpO₂ (%) — jika tak ada PaO₂<input type="number" placeholder="95" value={spo2} onChange={e => setSpo2(e.target.value)} /></label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={effusion} onChange={e => setEffusion(e.target.checked)} />
          Pleural effusion (+10)
        </label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung PSI</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: `var(--${res.color})` }}>{res.score}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>PSI {res.pClass} — Mortalitas 30-hari {res.mort}</div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: `var(--${res.color}-bg, var(--bg))`, border: `1px solid var(--${res.color})`, fontSize: 13, lineHeight: 1.6 }}>{res.action}</div>
        </div>
      )}
    </div>
  )
}

function SmartCopPanel() {
  const items = [
    { k: 's', label: 'S — Sistolik <90 mmHg', max: 2 },
    { k: 'm', label: 'M — Multilobar infiltrat pada foto thorax', max: 1 },
    { k: 'a', label: 'A — Albumin <3.5 g/dL', max: 1 },
    { k: 'r', label: 'R — RR tinggi (≥25/mnt usia <50, ≥30/mnt usia ≥50)', max: 1 },
    { k: 't', label: 'T — Takikardia ≥125 bpm', max: 1 },
    { k: 'c', label: 'C — Confusion baru', max: 1 },
    { k: 'o', label: 'O — Oksigenasi rendah (PaO₂<70 / SpO₂<93% / P/F<250)', max: 2 },
    { k: 'p', label: 'P — pH <7.35', max: 2 },
  ]
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(items.map(i => [i.k, 0])))
  const [res, setRes] = useState<ReturnType<typeof calcSmartCop> | null>(null)
  const calc = () => setRes(calcSmartCop(vals.s, vals.m, vals.a, vals.r, vals.t, vals.c, vals.o, vals.p))
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Prediksi kebutuhan PIIT (vasopressor/ventilasi mekanik) · Charles PG et al. Clin Infect Dis 2008</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <div key={item.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: `1px solid ${vals[item.k] > 0 ? 'var(--red)' : 'var(--border)'}`, background: vals[item.k] > 0 ? 'var(--red-bg, #fff5f5)' : 'var(--surface2, var(--bg))' }}>
            <div style={{ flex: 1, fontSize: 13 }}>{item.label}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: item.max + 1 }, (_, v) => (
                <button key={v} onClick={() => setVals(p => ({ ...p, [item.k]: v }))} style={{ width: 32, height: 32, borderRadius: 6, fontWeight: 700, cursor: 'pointer', background: vals[item.k] === v ? (v > 0 ? 'var(--red)' : 'var(--teal)') : 'var(--bg)', color: vals[item.k] === v ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}>{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-calc" onClick={calc}>Hitung SMART-COP</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: `var(--${res.color})` }}>{res.score}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: `var(--${res.color})`, marginTop: 4 }}>SMART-COP {res.score}/11 — {res.risk}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Estimasi risiko PIIT: {res.pct}</div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: `var(--${res.color}-bg, var(--bg))`, border: `1px solid var(--${res.color})`, fontSize: 13, lineHeight: 1.6 }}>{res.action}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>PIIT = Prolonged Intensive Inpatient Treatment (vasopressor dan/atau ventilasi mekanik invasif)</div>
        </div>
      )}
    </div>
  )
}

function AaPanel() {
  const [fio2, setFio2] = useState(''); const [paco2, setPaco2] = useState(''); const [pao2, setPao2] = useState('')
  const [patm, setPatm] = useState('760'); const [age, setAge] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcAaGradient> | null>(null)
  const calc = () => {
    const f = parseFloat(fio2), pc = parseFloat(paco2), pa = parseFloat(pao2)
    if (!f || !pc || !pa) return
    setRes(calcAaGradient(f, pc, pa, parseFloat(patm) || 760, age ? parseFloat(age) : undefined))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Alveolar-arterial O₂ gradient · Membedakan hipoventilasi vs V/Q mismatch/shunt</p>
      <div className="form-grid">
        <label>FiO₂ (0–1)<input type="number" placeholder="0.21" step="0.01" value={fio2} onChange={e => setFio2(e.target.value)} /></label>
        <label>PaCO₂ (mmHg)<input type="number" placeholder="40" value={paco2} onChange={e => setPaco2(e.target.value)} /></label>
        <label>PaO₂ (mmHg)<input type="number" placeholder="90" value={pao2} onChange={e => setPao2(e.target.value)} /></label>
        <label>Tekanan Atm (mmHg)<input type="number" placeholder="760" value={patm} onChange={e => setPatm(e.target.value)} /></label>
        <label>Usia (thn, opsional)<input type="number" placeholder="mis. 50" value={age} onChange={e => setAge(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung A-a Gradient</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
            {[['A-a Gradient', `${res.aaGrad} mmHg`, res.color], ['PAO₂ (alveolar)', `${res.paO2calc} mmHg`, null], [`Normal ≤${res.normalAa}`, 'threshold', null]].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: `var(--${res.color}-bg, var(--bg))`, border: `1px solid var(--${res.color})`, fontSize: 13, lineHeight: 1.6 }}>
            {res.interp}
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
              PAO₂ = {fio2} × ({patm}−47) − {paco2}/0.8 = {res.paO2calc} mmHg · Normal ≈ Usia/4 + 4 = {res.normalAa} mmHg
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Pulmo() {
  const [tab, setTab] = useState<Tab>('CURB-65')
  const panels: Record<Tab, JSX.Element> = {
    'CURB-65': <Curb65Panel />, 'PSI/PORT': <PsiPanel />,
    'SMART-COP': <SmartCopPanel />, 'A-a Gradient': <AaPanel />,
  }
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px' }}>Kalkulator Pulmo</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>CURB-65 · PSI/PORT · SMART-COP · A-a Gradient</p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: tab === t ? 'var(--accent, var(--teal))' : 'var(--surface2, var(--bg))',
            color: tab === t ? '#fff' : 'var(--text)',
            border: `1.5px solid ${tab === t ? 'var(--accent, var(--teal))' : 'var(--border)'}`,
          }}>{t}</button>
        ))}
      </div>
      {panels[tab]}
    </div>
  )
}

import { useState } from 'react'
import { calcPrc, calcWb, calcFfp, calcTc, calcCryo } from '../lib/transfusi'

const TABS = ['PRC', 'Whole Blood', 'FFP', 'Trombosit', 'Cryoprecipitate'] as const
type Tab = typeof TABS[number]

function CaAlert() {
  return (
    <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--amber)', background: 'var(--amber-bg, #fffbeb)', fontSize: 12, lineHeight: 1.6 }}>
      <strong>⚠ Ca-Glukonat (Transfusi ≥4 Kolf)</strong><br />
      Sitrat dalam produk darah mengikat Ca²⁺ ionisasi → hipokalsemia → disfungsi miokard + koagulopati.<br />
      <strong>Dosis:</strong> Ca-Glukonas 10% 1 g IV per 4 kolf | <strong>Target iCa²⁺:</strong> ≥1,1 mmol/L | Berikan IV pelan 3–5 menit via jalur TERPISAH dari darah.
    </div>
  )
}

function PrcPanel() {
  const [hb, setHb] = useState(''); const [hbt, setHbt] = useState(''); const [bb, setBb] = useState(''); const [sex, setSex] = useState<'m' | 'f'>('m')
  const [res, setRes] = useState<ReturnType<typeof calcPrc> | null>(null)
  const calc = () => {
    const h = parseFloat(hb), t = parseFloat(hbt), b = parseFloat(bb)
    if (!h || !t || !b || t <= h) return
    setRes(calcPrc(h, t, b, sex))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Packed Red Cells · Formula: ΔHb × BB × 4</p>
      <div className="form-grid">
        <label>Hb Aktual (g/dL)<input type="number" placeholder="7.0" step="0.1" value={hb} onChange={e => setHb(e.target.value)} /></label>
        <label>Hb Target (g/dL)<input type="number" placeholder="10.0" step="0.1" value={hbt} onChange={e => setHbt(e.target.value)} /></label>
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bb} onChange={e => setBb(e.target.value)} /></label>
        <label>Jenis Kelamin
          <select value={sex} onChange={e => setSex(e.target.value as 'm' | 'f')}>
            <option value="m">Laki-laki (EBV 70 mL/kg)</option>
            <option value="f">Perempuan (EBV 65 mL/kg)</option>
          </select>
        </label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung PRC</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              ['Volume PRC', `${res.volMl} mL`, 'red'],
              ['Jumlah Kolf', `${res.kolf} kolf`, 'red'],
              ['ΔHb / 1 Kolf', `+${res.dHbPerKolf} g/dL`, null],
              ['EBV', `${res.ebvL.toFixed(2)} L`, null],
              ['Rate (2 jam)', `${res.rateStd} mL/jam`, null],
            ].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, background: 'var(--surface2, var(--bg))', borderRadius: 8, padding: 12, lineHeight: 1.6 }}>
            ΔHb: {hb} → {hbt} g/dL (+{res.dHb.toFixed(1)} g/dL) · Formula: {res.dHb.toFixed(1)} × {bb} × 4 = {res.volMl} mL<br />
            MABL (trigger 7 g/dL): {res.mablMl} mL allowable blood loss. Cek Hb ulang 15–30 mnt pasca transfusi.
          </div>
          {res.needCa && <CaAlert />}
        </div>
      )}
    </div>
  )
}

function WbPanel() {
  const [hb, setHb] = useState(''); const [hbt, setHbt] = useState(''); const [bb, setBb] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcWb> | null>(null)
  const calc = () => {
    const h = parseFloat(hb), t = parseFloat(hbt), b = parseFloat(bb)
    if (!h || !t || !b || t <= h) return
    setRes(calcWb(h, t, b))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Whole Blood · Formula: ΔHb × BB × 6 · 1 kolf ≈ 450 mL</p>
      <div className="form-grid">
        <label>Hb Aktual (g/dL)<input type="number" placeholder="7.0" step="0.1" value={hb} onChange={e => setHb(e.target.value)} /></label>
        <label>Hb Target (g/dL)<input type="number" placeholder="10.0" step="0.1" value={hbt} onChange={e => setHbt(e.target.value)} /></label>
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bb} onChange={e => setBb(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung WB</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              ['Volume WB', `${res.volMl} mL`, 'teal'],
              ['Jumlah Kolf', `${res.kolf} kolf`, 'teal'],
              ['ΔHb / 1 Kolf', `+${res.dHbPerKolf} g/dL`, null],
            ].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            WB jarang tersedia di BDRS Indonesia — biasanya segera diproses menjadi komponen (PRC + FFP + TC). Formula: {res.dHb.toFixed(1)} × {bb} × 6 = {res.volMl} mL.
          </div>
          {res.needCa && <CaAlert />}
        </div>
      )}
    </div>
  )
}

function FfpPanel() {
  const [bb, setBb] = useState(''); const [dose, setDose] = useState('15'); const [inr, setInr] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcFfp> | null>(null)
  const calc = () => {
    const b = parseFloat(bb)
    if (!b) return
    setRes(calcFfp(b, parseFloat(dose), inr ? parseFloat(inr) : undefined))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Fresh Frozen Plasma · 1 kolf ≈ 250 mL · Semua faktor koagulasi aktif</p>
      <div className="form-grid">
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bb} onChange={e => setBb(e.target.value)} /></label>
        <label>Dosis (mL/kg)
          <select value={dose} onChange={e => setDose(e.target.value)}>
            <option value="10">10 mL/kg — koreksi sedang</option>
            <option value="15">15 mL/kg — standar</option>
            <option value="20">20 mL/kg — koreksi agresif</option>
            <option value="30">30 mL/kg — perdarahan masif</option>
          </select>
        </label>
        <label>INR (opsional)<input type="number" placeholder="mis. 2.5" step="0.1" value={inr} onChange={e => setInr(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung FFP</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              ['Volume FFP', `${res.volMl} mL`, 'amber'],
              ['Jumlah Kolf', `${res.kolf} kolf`, 'amber'],
              ['Rate (2 jam)', `${res.rate} mL/jam`, null],
            ].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          {res.inrNote === 'low' && <div style={{ fontSize: 12, color: 'var(--amber)', padding: '8px 12px', borderRadius: 8, background: 'var(--amber-bg, #fffbeb)', border: '1px solid var(--amber)' }}>INR &lt;1.5 — di bawah threshold standar. FFP mungkin tidak diperlukan jika tidak ada perdarahan aktif.</div>}
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>Pastikan ABO compatible. Gunakan dalam 4 jam setelah thaw. Pasang filter 170–260 μm. Monitor tanda overload (TACO).</div>
        </div>
      )}
    </div>
  )
}

function TcPanel() {
  const [plt, setPlt] = useState(''); const [pltt, setPltt] = useState(''); const [bb, setBb] = useState(''); const [tipe, setTipe] = useState<'rd' | 'apheresis'>('rd')
  const [res, setRes] = useState<ReturnType<typeof calcTc> | null>(null)
  const calc = () => {
    const p = parseFloat(plt), pt = parseFloat(pltt), b = parseFloat(bb)
    if (!p || !pt || !b) return
    setRes(calcTc(p, pt, b, tipe))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Trombosit Concentrate · Random Donor atau Apheresis (SDA)</p>
      <div className="form-grid">
        <label>Plt Aktual (×10³/µL)<input type="number" placeholder="20" value={plt} onChange={e => setPlt(e.target.value)} /></label>
        <label>Plt Target (×10³/µL)<input type="number" placeholder="50" value={pltt} onChange={e => setPltt(e.target.value)} /></label>
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bb} onChange={e => setBb(e.target.value)} /></label>
        <label>Tipe TC
          <select value={tipe} onChange={e => setTipe(e.target.value as 'rd' | 'apheresis')}>
            <option value="rd">Random Donor (RD) — 1 unit ≈ 60 mL</option>
            <option value="apheresis">Apheresis / SDA — 1 kantong ≈ 250 mL</option>
          </select>
        </label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung TC</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            {tipe === 'rd' ? [
              ['Unit RD', `${res.unitRec} unit`, 'orange'],
              ['Volume', `${res.volTotal} mL`, null],
              ['Estimasi ΔPlt', `+${res.expIncrement} ×10³`, null],
            ] : [
              ['Kantong SDA', `1 kantong`, 'orange'],
              ['Volume', `250 mL`, null],
              ['Estimasi ΔPlt', `+${res.expIncrement} ×10³`, null],
            ].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Cek platelet 1 jam post-transfusi. CCI target &gt;7.500. Jika CCI rendah → curiga refraktori (HLA/HPA antibodi).
            {tipe === 'apheresis' && ' Keuntungan SDA: donor tunggal (↓ alloimmunisasi), HLA-matched tersedia jika refraktori.'}
          </div>
        </div>
      )}
    </div>
  )
}

function CryoPanel() {
  const [fib, setFib] = useState(''); const [fibTarget, setFibTarget] = useState('200'); const [bb, setBb] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcCryo> | null>(null)
  const calc = () => {
    const f = parseFloat(fib), ft = parseFloat(fibTarget), b = parseFloat(bb)
    if (!f || !ft || !b) return
    setRes(calcCryo(f, ft, b))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Cryoprecipitate · 1 kolf ≈ 15–20 mL · Fibrinogen 150–250 mg/kolf</p>
      <div className="form-grid">
        <label>Fibrinogen Aktual (mg/dL)<input type="number" placeholder="80" value={fib} onChange={e => setFib(e.target.value)} /></label>
        <label>Target Fibrinogen (mg/dL)
          <select value={fibTarget} onChange={e => setFibTarget(e.target.value)}>
            <option value="150">150 mg/dL — perdarahan aktif</option>
            <option value="200">200 mg/dL — standar</option>
            <option value="250">250 mg/dL — trauma/obstetri</option>
          </select>
        </label>
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bb} onChange={e => setBb(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Cryo</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          {res.severe && <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--red-bg, #fff5f5)', border: '1px solid var(--red)', fontSize: 12, marginBottom: 12, color: 'var(--red)' }}><strong>⚠ Hipofibrinogenemia Berat (&lt;100 mg/dL)</strong> — Risiko perdarahan sangat tinggi. Pertimbangkan cryoprecipitate + FFP bersamaan.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            {[
              ['Kolf Cryo', `${res.kolfRec} kolf`, 'blue'],
              ['Volume', `${res.volTotal} mL`, null],
              ['Defisit Fib', `${res.fibDeficit} mg`, null],
              ['Fib Post-Tx', `~${res.fibExpected} mg/dL`, null],
            ].map(([label, val, c]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 8, border: `1px solid ${c ? `var(--${c})` : 'var(--border)'}` }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c ? `var(--${c})` : 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Formula: {res.kolfFormula} kolf (kalkulasi defisit) vs {res.kolfRuleOfThumb} kolf (1/10 kg BB) → diambil lebih besar.<br />
            Gunakan dalam 6 jam setelah thaw. Cek fibrinogen ulang 30–60 mnt pasca transfusi.
          </div>
        </div>
      )}
    </div>
  )
}

export function Transfusi() {
  const [tab, setTab] = useState<Tab>('PRC')
  const panels: Record<Tab, JSX.Element> = {
    'PRC': <PrcPanel />, 'Whole Blood': <WbPanel />, 'FFP': <FfpPanel />,
    'Trombosit': <TcPanel />, 'Cryoprecipitate': <CryoPanel />,
  }
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px' }}>Kalkulator Transfusi</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>PRC · Whole Blood · FFP · Trombosit · Cryoprecipitate</p>
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

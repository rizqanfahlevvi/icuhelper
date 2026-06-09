import { useState } from 'react'
import { calcEgfr, calcAki, calcFena, calcOsmolality, calcBunCr } from '../lib/renal'

const TABS = ['eGFR / CKD', 'AKI KDIGO', 'FENa / FEUrea', 'Osmolalitas', 'BUN:Cr Ratio'] as const
type Tab = typeof TABS[number]

function ResultCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 8, border: `1px solid ${color ? `var(--${color})` : 'var(--border)'}` }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color ? `var(--${color})` : 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function InterpBox({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: `var(--${color}-bg, var(--bg))`, border: `1px solid var(--${color})`, fontSize: 13, lineHeight: 1.6 }}>
      <strong>{label}</strong><br />{text}
    </div>
  )
}

function EgfrPanel() {
  const [sex, setSex] = useState<'m' | 'f'>('m'); const [age, setAge] = useState(''); const [scr, setScr] = useState('')
  const [bw, setBw] = useState(''); const [cysc, setCysc] = useState(''); const [ureum, setUreum] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcEgfr> | null>(null)
  const calc = () => {
    if (!age || !scr) return
    setRes(calcEgfr(sex, parseFloat(age), parseFloat(scr), bw ? parseFloat(bw) : undefined, cysc ? parseFloat(cysc) : undefined, ureum ? parseFloat(ureum) : undefined))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>CKD-EPI 2021 (race-free) · Cockcroft-Gault · MDRD-4 · CKD-EPI Cystatin C</p>
      <div className="form-grid">
        <label>Jenis Kelamin<select value={sex} onChange={e => setSex(e.target.value as 'm' | 'f')}><option value="m">Laki-laki</option><option value="f">Perempuan</option></select></label>
        <label>Usia (thn)<input type="number" placeholder="50" value={age} onChange={e => setAge(e.target.value)} /></label>
        <label>Kreatinin Serum (mg/dL)<input type="number" placeholder="1.2" step="0.01" value={scr} onChange={e => setScr(e.target.value)} /></label>
        <label>Berat Badan (kg) — untuk CG<input type="number" placeholder="60" value={bw} onChange={e => setBw(e.target.value)} /></label>
        <label>Cystatin C (mg/L) — opsional<input type="number" placeholder="1.0" step="0.01" value={cysc} onChange={e => setCysc(e.target.value)} /></label>
        <label>Ureum (mg/dL) — opsional<input type="number" placeholder="30" value={ureum} onChange={e => setUreum(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung eGFR</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
            <ResultCard label="CKD-EPI 2021 ★" value={`${res.ckdEpi}`} sub="mL/mnt/1.73m²" color={res.color} />
            {res.cg && <ResultCard label="Cockcroft-Gault (CrCl)" value={`${res.cg}`} sub="mL/mnt · untuk dosis obat" />}
            <ResultCard label="MDRD-4 (legacy)" value={`${res.mdrd}`} sub="mL/mnt/1.73m²" />
            {res.ckdCys && <ResultCard label="CKD-EPI Cys-C 2021" value={`${res.ckdCys}`} sub="mL/mnt/1.73m²" color="purple" />}
          </div>
          <InterpBox label={`Stadium CKD — ${res.stage}`} text={res.stageLabel + ' mL/mnt/1.73m²'} color={res.color} />
          {res.bunMgdl != null && res.bunCrRatio != null && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Ureum {ureum} mg/dL = {res.bunMmol} mmol/L = BUN {res.bunMgdl} mg/dL · Rasio BUN/SCr: <strong>{res.bunCrRatio}</strong> — {res.bunCrInterp}
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>★ CKD-EPI 2021 race-free adalah formula primer per KDIGO 2024. CG untuk penyesuaian dosis obat. | Inker LA et al. NEJM 2021;385:1737</div>
        </div>
      )}
    </div>
  )
}

function AkiPanel() {
  const [scrBase, setScrBase] = useState(''); const [scrNow, setScrNow] = useState('')
  const [bw, setBw] = useState(''); const [uoVol, setUoVol] = useState(''); const [uoHr, setUoHr] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcAki> | null>(null)
  const calc = () => {
    const sb = scrBase ? parseFloat(scrBase) : undefined
    const sn = scrNow ? parseFloat(scrNow) : undefined
    const b = bw ? parseFloat(bw) : undefined
    const v = uoVol ? parseFloat(uoVol) : undefined
    const h = uoHr ? parseFloat(uoHr) : undefined
    if (!sb && !b) return
    setRes(calcAki(sb, sn, b, v, h))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>AKI KDIGO 2012 — staging berdasarkan SCr dan/atau UO</p>
      <div className="form-grid">
        <label>SCr Baseline (mg/dL)<input type="number" placeholder="0.9" step="0.01" value={scrBase} onChange={e => setScrBase(e.target.value)} /></label>
        <label>SCr Sekarang (mg/dL)<input type="number" placeholder="2.1" step="0.01" value={scrNow} onChange={e => setScrNow(e.target.value)} /></label>
        <label>Berat Badan (kg)<input type="number" placeholder="60" value={bw} onChange={e => setBw(e.target.value)} /></label>
        <label>Volume Urine (mL)<input type="number" placeholder="300" value={uoVol} onChange={e => setUoVol(e.target.value)} /></label>
        <label>Durasi (jam)<input type="number" placeholder="8" value={uoHr} onChange={e => setUoHr(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung AKI</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          {res.scrStage != null && (
            <div style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 8, border: `1px solid var(--${res.scrColor})`, background: `var(--${res.scrColor}-bg, var(--bg))` }}>
              <div style={{ fontWeight: 700, color: `var(--${res.scrColor})` }}>Berdasarkan SCr{res.scrStage > 0 ? ` — AKI KDIGO Stage ${res.scrStage}` : ''}</div>
              <div style={{ fontSize: 13 }}>{res.scrLabel}</div>
              {scrBase && scrNow && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Kenaikan: +{(parseFloat(scrNow) - parseFloat(scrBase)).toFixed(2)} mg/dL · Rasio: ×{(parseFloat(scrNow) / parseFloat(scrBase)).toFixed(2)} (baseline {scrBase} → {scrNow} mg/dL)
              </div>}
            </div>
          )}
          {res.uoStage != null && res.uoRate != null && (
            <div style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid var(--${res.uoColor})`, background: `var(--${res.uoColor}-bg, var(--bg))` }}>
              <div style={{ fontWeight: 700, color: `var(--${res.uoColor})` }}>Berdasarkan UO{res.uoStage > 0 ? ` — AKI KDIGO Stage ${res.uoStage}` : ''}</div>
              <div style={{ fontSize: 13 }}>{res.uoLabel}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Rate UO: <strong>{res.uoRate} mL/kg/jam</strong> ({uoVol} mL / {uoHr} jam / {bw} kg)</div>
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>KDIGO 2012: staging diambil dari kriteria yang paling berat. Stage 3 juga jika ada kebutuhan RRT. | Kidney Int Suppl 2012;2:1</div>
        </div>
      )}
    </div>
  )
}

function FenaPanel() {
  const [sna, setSna] = useState(''); const [scr, setScr] = useState(''); const [una, setUna] = useState(''); const [ucr, setUcr] = useState('')
  const [sureum, setSureum] = useState(''); const [uureum, setUureum] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcFena> | null>(null)
  const calc = () => {
    if (!sna || !scr || !una || !ucr) return
    setRes(calcFena(parseFloat(sna), parseFloat(scr), parseFloat(una), parseFloat(ucr), sureum ? parseFloat(sureum) : undefined, uureum ? parseFloat(uureum) : undefined))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Fractional Excretion of Na/Urea · Membedakan Pre-renal vs Renal intrinsik</p>
      <div className="form-grid">
        <label>Na Serum (mEq/L)<input type="number" placeholder="140" value={sna} onChange={e => setSna(e.target.value)} /></label>
        <label>Kreatinin Serum (mg/dL)<input type="number" placeholder="2.1" step="0.01" value={scr} onChange={e => setScr(e.target.value)} /></label>
        <label>Na Urin (mEq/L)<input type="number" placeholder="10" value={una} onChange={e => setUna(e.target.value)} /></label>
        <label>Kreatinin Urin (mg/dL)<input type="number" placeholder="120" value={ucr} onChange={e => setUcr(e.target.value)} /></label>
        <label>Ureum Serum (mg/dL) — untuk FEUrea<input type="number" placeholder="opsional" value={sureum} onChange={e => setSureum(e.target.value)} /></label>
        <label>Ureum Urin (mg/dL) — untuk FEUrea<input type="number" placeholder="opsional" value={uureum} onChange={e => setUureum(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung FENa</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
            <ResultCard label="FENa" value={`${res.fena}%`} sub={res.fena < 1 ? 'Pre-renal (<1%)' : res.fena < 2 ? 'Equivocal (1–2%)' : 'Renal (>2%)'} color={res.fenaColor} />
            {res.feurea != null && <ResultCard label="FEUrea" value={`${res.feurea}%`} sub={res.feurea < 35 ? 'Pre-renal (<35%)' : res.feurea < 50 ? 'Equivocal' : 'Renal (>50%)'} color={res.feureaColor ?? undefined} />}
          </div>
          <InterpBox label={`FENa: ${res.fena}%`} text={res.fenaInterp} color={res.fenaColor} />
          {res.feurea != null && res.feureaInterp && <InterpBox label={`FEUrea: ${res.feurea}%`} text={res.feureaInterp} color={res.feureaColor ?? 'teal'} />}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>FENa tidak valid pada pasien diuretik → gunakan FEUrea. | Miller TR. Ann Intern Med 1978;89:47</div>
        </div>
      )}
    </div>
  )
}

function OsmPanel() {
  const [na, setNa] = useState(''); const [glu, setGlu] = useState(''); const [ureum, setUreum] = useState(''); const [measured, setMeasured] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcOsmolality> | null>(null)
  const calc = () => { if (!na || !glu || !ureum) return; setRes(calcOsmolality(parseFloat(na), parseFloat(glu), parseFloat(ureum), measured ? parseFloat(measured) : undefined)) }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Osmolalitas terhitung + Osmol Gap · Formula: 2×Na + Glu/18 + Ureum/6</p>
      <div className="form-grid">
        <label>Na Serum (mEq/L)<input type="number" placeholder="140" value={na} onChange={e => setNa(e.target.value)} /></label>
        <label>Glukosa (mg/dL)<input type="number" placeholder="100" value={glu} onChange={e => setGlu(e.target.value)} /></label>
        <label>Ureum (mg/dL)<input type="number" placeholder="30" value={ureum} onChange={e => setUreum(e.target.value)} /></label>
        <label>Osmolalitas Terukur (mOsm/kg) — opsional<input type="number" placeholder="dari lab" value={measured} onChange={e => setMeasured(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Osmolalitas</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
            <ResultCard label="Osmolalitas Terhitung" value={`${res.osmCalc}`} sub="mOsm/kg · Normal 285–295" color={res.color} />
            {res.osmGap != null && <ResultCard label="Osmol Gap" value={`${res.osmGap}`} sub="mOsm/kg · Normal <10" color={res.gapColor} />}
          </div>
          <InterpBox label="Osmolalitas" text={res.interp} color={res.color} />
          {res.osmGap != null && res.gapInterp && <InterpBox label={`Osmol Gap: ${res.osmGap} mOsm/kg`} text={res.gapInterp} color={res.gapColor ?? 'teal'} />}
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>Formula: 2×{na} + {glu}/18 + {ureum}/6 = {res.osmCalc} mOsm/kg | Bhagat CI. Ann Clin Biochem 2001</div>
        </div>
      )}
    </div>
  )
}

function BunCrPanel() {
  const [bun, setBun] = useState(''); const [cr, setCr] = useState(''); const [ureum, setUreum] = useState('')
  const [res, setRes] = useState<ReturnType<typeof calcBunCr> | null>(null)
  const calcFromUreum = (u: string) => { if (u) setBun((parseFloat(u) / 2.14).toFixed(1)) }
  const calc = () => {
    const b = bun ? parseFloat(bun) : ureum ? parseFloat(ureum) / 2.14 : NaN
    if (isNaN(b) || !cr) return
    setRes(calcBunCr(b, parseFloat(cr)))
  }
  return (
    <div className="calc-box">
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>BUN:Kreatinin Ratio · Pre-renal vs Renal vs Perdarahan GI atas</p>
      <div className="form-grid">
        <label>Ureum (mg/dL) — konversi otomatis ke BUN<input type="number" placeholder="mis. 40" value={ureum} onChange={e => { setUreum(e.target.value); calcFromUreum(e.target.value) }} /></label>
        <label>BUN (mg/dL) — atau isi langsung<input type="number" placeholder="mis. 18.7" step="0.1" value={bun} onChange={e => setBun(e.target.value)} /></label>
        <label>Kreatinin Serum (mg/dL)<input type="number" placeholder="1.0" step="0.01" value={cr} onChange={e => setCr(e.target.value)} /></label>
      </div>
      <button className="btn-calc" onClick={calc}>Hitung Rasio</button>
      {res && (
        <div className="result-card" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
            <ResultCard label="BUN" value={`${bun || (ureum ? (parseFloat(ureum)/2.14).toFixed(1) : '—')} mg/dL`} />
            <ResultCard label="Kreatinin" value={`${cr} mg/dL`} />
            <ResultCard label="Rasio BUN:Cr" value={`${res.ratio}`} sub="Normal: 10–20" color={res.color} />
          </div>
          <InterpBox label={res.title} text={res.interp} color={res.color} />
          {res.giBleeding && (
            <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'var(--red-bg, #fff5f5)', border: '1px solid var(--red)', fontSize: 13, lineHeight: 1.6 }}>
              <strong>🩸 BUN:Cr &gt;36 — Curiga Perdarahan GI Atas</strong><br />
              Rasio &gt;36 memiliki spesifisitas ~97% untuk perdarahan GI atas. Darah di lumen usus dicerna sebagai sumber protein → BUN naik cepat.<br />
              <strong>Pertimbangkan endoskopi segera jika ada tanda klinis (melena, hematemesis, anemia akut).</strong><br />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Srygley FD. Ann Intern Med 2012;156:48</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Renal() {
  const [tab, setTab] = useState<Tab>('eGFR / CKD')
  const panels: Record<Tab, JSX.Element> = {
    'eGFR / CKD': <EgfrPanel />, 'AKI KDIGO': <AkiPanel />,
    'FENa / FEUrea': <FenaPanel />, 'Osmolalitas': <OsmPanel />, 'BUN:Cr Ratio': <BunCrPanel />,
  }
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 4px' }}>Kalkulator Renal</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>eGFR · AKI KDIGO · FENa/FEUrea · Osmolalitas · BUN:Cr Ratio</p>
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

import { Accordion, InfoBox, SectionTable } from './parts'

export function GagalNapas() {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <InfoBox color="red">
          <p className="font-bold mb-1">Definisi Gagal Napas</p>
          <p><strong>Hipoksemia:</strong> PaO₂ &lt;60 mmHg pada udara kamar</p>
          <p><strong>Hiperkapnia:</strong> PaCO₂ &gt;45 mmHg</p>
          <p className="mt-1 text-xs">Akut: &lt;72 jam · Kronik: &gt;72 jam · Akut-on-kronik: dekompensasi pada CRF</p>
        </InfoBox>
        <InfoBox color="blue">
          <p className="font-bold mb-1">Definisi ARDS 2023 (Update)</p>
          <p>SpO₂/FiO₂ ≤315 sebagai pengganti P/F. HFNC ≥30 L/mnt kini masuk kriteria. Bilateral infiltrat. Onset akut ≤7 hari.</p>
        </InfoBox>
      </div>

      <Accordion title="Tipe I — Gagal Napas Hipoksemia (PaO₂ <60 mmHg)" defaultOpen>
        <SectionTable
          headers={['Mekanisme', 'Contoh', 'A-a Gradient', 'Respons O₂']}
          rows={[
            ['V/Q Mismatch', 'PE, PPOK, pneumonia', 'Meningkat', 'Baik'],
            ['Shunt', 'ARDS, atelektasis, pneumonia berat', 'Meningkat', 'Buruk (refrakter)'],
            ['Diffusion Impairment', 'Fibrosis, edema interstisial', 'Meningkat', 'Sedang'],
            ['Hipoventilasi', 'OHS, overdosis sedatif', 'Normal', 'Baik'],
            ['FiO₂ rendah', 'Ketinggian, kebakaran', 'Normal', 'Baik'],
          ]}
        />
        <InfoBox color="teal">
          <p><strong>A-a Gradient</strong> = PAO₂ − PaO₂ = [FiO₂ × (Patm−47) − PaCO₂/0.8] − PaO₂</p>
          <p className="text-xs mt-1">Normal: &lt;10 mmHg (muda), &lt;15–20 (lansia). Meningkat → gangguan pertukaran gas.</p>
        </InfoBox>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Terapi Khusus ARDS Berat</p>
          <ul className="space-y-1 text-slate-600">
            <li>• <strong>Prone position:</strong> P/F &lt;150 + FiO₂ ≥0.6 &gt;12 jam → prone 16 jam/hari (PROSEVA: mortalitas 32.8% → 16%)</li>
            <li>• <strong>NMB (Cisatrakurium):</strong> P/F &lt;120 dengan sedasi dalam — 48 jam pertama</li>
            <li>• <strong>Driving Pressure:</strong> Target ≤14 cmH₂O — DRIVINGARDS trial</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="Tipe II — Gagal Napas Hiperkapnia (PaCO₂ >45 mmHg)">
        <SectionTable
          headers={['Mekanisme', 'Contoh Klinis']}
          rows={[
            ['Drive napas ↓', 'Overdosis opioid/benzodiazepin, stroke batang otak, hipotiroid'],
            ['Pompa napas gagal', 'GBS, miastenia gravis, ICUAW, kifoskoliosis berat'],
            ['Beban napas ↑', 'PPOK berat, asma berat, stenosis saluran napas'],
            ['Dead space ↑', 'ARDS berat (VD/VT >0.6), PE masif'],
          ]}
        />
        <InfoBox>
          <strong>Dead Space (VD/VT) Bohr:</strong> Normal 0.3 (30%). ARDS berat: 0.6–0.7. VD/VT tinggi → PaCO₂ ↑ meski RR normal.
        </InfoBox>
      </Accordion>

      <Accordion title="Tipe III & IV — Perioperatif & Hipoperfusi">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-700 mb-1">Tipe III — Perioperatif / Atelektasis</p>
            <ul className="text-slate-600 space-y-0.5">
              <li>• Atelektasis masif post-anestesi: collapse lobus/segmen besar</li>
              <li>• Tatalaksana: rekruitmen maneuver, CPAP/PEEP, fisioterapi dada, mobilisasi dini</li>
              <li>• PEEP 5–8 cmH₂O post-op mencegah atelektasis residual</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-1">Tipe IV — Hipoperfusi / Syok</p>
            <ul className="text-slate-600 space-y-0.5">
              <li>• DO₂ = CO × CaO₂ = CO × (Hb × 1.34 × SaO₂ + PaO₂ × 0.003)</li>
              <li>• Gagal napas akibat syok: otot napas mengkonsumsi 40–50% VO₂ total</li>
              <li>• Intubasi + sedasi → ↓ WOB → ↑ DO₂ ke organ vital</li>
              <li>• Stabilisasi hemodinamik SEBELUM intubasi jika memungkinkan</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  )
}

import { Accordion, InfoBox, SectionTable } from './parts'

export function Fisiologi() {
  return (
    <div className="space-y-4">
      <InfoBox color="blue">
        <p className="font-bold mb-1">Fisiologi Ventilasi & Mekanika Paru</p>
        <p>Dasar fisika napas: compliance, resistensi, work of breathing, mode ventilator, dan PEEP.</p>
      </InfoBox>

      <Accordion title="Compliance, Resistensi & Work of Breathing" defaultOpen>
        <SectionTable
          headers={['Kondisi', 'Compliance (mL/cmH₂O)', 'Keterangan']}
          rows={[
            ['Normal', '60–100', 'Paru sehat dewasa'],
            ['ARDS', '15–30', '↓↓ — kaku, alveoli kolaps'],
            ['Fibrosis Paru', '<30', 'Fibrosis ekstensif'],
            ['PPOK', '>100 (emfisema)', 'Hiperinflasi, air trapping'],
            ['Obesitas / Abdomen', '↓', 'Tekanan abdominal ↑'],
            ['Edema Paru', '20–40', 'Edema interstisial'],
          ]}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <InfoBox color="teal">
            <p className="font-semibold">Driving Pressure (DP)</p>
            <p className="font-mono text-lg text-center my-1">DP = Pplat − PEEP</p>
            <p>Target ≤15 cmH₂O. DP prediktor mortalitas ARDS terkuat (Amato, NEJM 2015).</p>
          </InfoBox>
          <InfoBox color="purple">
            <p className="font-semibold">Mechanical Power (MP)</p>
            <p className="text-xs mt-1">Energi yang ditransfer ventilator ke paru per menit. Target &lt;17 J/min. Tinggi → VILI.</p>
            <p className="text-xs mt-1">Work of Breathing normal: 0.3–0.6 J/L. ICU: 10–20× lebih tinggi.</p>
          </InfoBox>
        </div>
      </Accordion>

      <Accordion title="Mode Ventilasi — VC vs PC, SIMV, PSV, PRVC">
        <SectionTable
          headers={['Mode', 'Parameter Terkontrol', 'Variabel', 'Penggunaan Klinis']}
          rows={[
            ['VC-AC', 'VT, RR', 'PIP bervariasi', 'ARDS, post-op, standard ICU'],
            ['PC-AC', 'PIP, RR', 'VT bervariasi', 'Paru heterogen, ARDS berat (awasi VT)'],
            ['SIMV', 'VT (atau PIP) + RR min', 'Napas spontan di antara', 'Weaning bertahap (kurang direkomendasikan)'],
            ['PSV', 'PS support level', 'VT dan RR spontan', 'Weaning, SBT, napas parsial spontan'],
            ['CPAP', 'PEEP', 'Semua spontan', 'SBT, post-ekstubasi non-invasif'],
            ['PRVC/APCV', 'VT target — otomatis atur PIP', 'PIP bervariasi adaptif', 'Compliance berubah-ubah'],
            ['APRV', 'P-high / P-low / T-high / T-low', 'VT dari limpasan P-high', 'ARDS refrakter, auto-PEEP tinggi'],
          ]}
        />
      </Accordion>

      <Accordion title="PEEP — Fisiologi, Titrasi & ARDSNet FiO₂/PEEP Table">
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="font-semibold text-slate-700 mb-1">Efek Fisiologis PEEP</p>
            <ul className="text-slate-600 space-y-0.5">
              <li>✓ ↑FRC — cegah alveolar collapse</li>
              <li>✓ ↓Shunt intrapulmonal</li>
              <li>✓ ↑PaO₂ pada ARDS</li>
              <li>⚠ ↓Preload (venostasis) jika PEEP tinggi</li>
              <li>⚠ Overdistensi alveoli normal jika berlebihan</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-1">Metode Titrasi PEEP</p>
            <ul className="text-slate-600 space-y-0.5">
              <li>• ARDSNet FiO₂/PEEP table (paling praktis)</li>
              <li>• Best PEEP trial (compliance terbaik)</li>
              <li>• Esophageal balloon (transpulmonary pressure)</li>
              <li>• Lung ultrasound (B-lines / consolidation)</li>
              <li>• EIT (electrical impedance tomography)</li>
            </ul>
          </div>
        </div>
        <p className="font-semibold text-slate-700 mb-2">ARDSNet Lower PEEP Strategy</p>
        <SectionTable
          headers={['FiO₂', '0.30', '0.40', '0.50', '0.60', '0.70', '0.80', '0.90', '1.0']}
          rows={[
            ['PEEP', '5', '5–8', '8–10', '10', '10–14', '14', '14–18', '18–24'],
          ]}
        />
      </Accordion>
    </div>
  )
}

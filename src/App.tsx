import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { Ibw } from './pages/Ibw'
import { Pf } from './pages/Pf'
import { Nlr } from './pages/Nlr'
import { Pump } from './pages/Pump'
import { Abg } from './pages/Abg'
import { Skoring } from './pages/Skoring'
import { Transfusi } from './pages/Transfusi'
import { Cairan } from './pages/Cairan'
import { Pulmo } from './pages/Pulmo'
import { Renal } from './pages/Renal'
import { Elektro } from './pages/Elektro'
import { Sedasi } from './pages/Sedasi'
import { DrugRef } from './pages/DrugRef'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="kalkulator/ibw" element={<Ibw />} />
        <Route path="kalkulator/pf" element={<Pf />} />
        <Route path="kalkulator/nlr" element={<Nlr />} />
        <Route path="kalkulator/pump" element={<Pump />} />
        <Route path="kalkulator/transfusi" element={<Transfusi />} />
        <Route path="kalkulator/cairan" element={<Cairan />} />
        <Route path="kalkulator/pulmo" element={<Pulmo />} />
        <Route path="kalkulator/renal" element={<Renal />} />
        <Route path="kalkulator/elektro" element={<Elektro />} />
        <Route path="kalkulator/sedasi" element={<Sedasi />} />
        <Route path="drug-ref" element={<DrugRef />} />
        <Route path="abg" element={<Abg />} />
        <Route path="skoring" element={<Skoring />} />
        <Route path="skoring/:sub" element={<Skoring />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

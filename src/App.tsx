import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { Ibw } from './pages/Ibw'
import { Pf } from './pages/Pf'
import { Nlr } from './pages/Nlr'
import { Pump } from './pages/Pump'
import { Abg } from './pages/Abg'
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
        <Route path="abg" element={<Abg />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

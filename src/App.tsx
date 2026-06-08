import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { Ibw } from './pages/Ibw'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="kalkulator/ibw" element={<Ibw />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

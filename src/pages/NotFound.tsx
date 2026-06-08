import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function NotFound() {
  return (
    <>
      <PageHeader title="Halaman belum dimigrasi" />
      <div className="info" style={{ marginTop: 12 }}>
        Halaman ini belum tersedia di versi React. Kembali ke{' '}
        <Link to="/">beranda</Link> atau gunakan menu navigasi.
      </div>
    </>
  )
}

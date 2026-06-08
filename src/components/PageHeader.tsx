export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="page-header">
      <div className="ph-title">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle" style={{ marginBottom: 0 }}>{subtitle}</p>}
      </div>
    </div>
  )
}





function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="accent-line" aria-hidden="true" />
      <span className="text-label">{label}</span>
    </div>
  )
}


export default SectionEyebrow
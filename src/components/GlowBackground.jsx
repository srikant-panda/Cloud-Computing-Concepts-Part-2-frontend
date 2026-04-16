export default function GlowBackground() {
  return (
    <>
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-purple-500/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-400/25 blur-[120px]" />
    </>
  )
}
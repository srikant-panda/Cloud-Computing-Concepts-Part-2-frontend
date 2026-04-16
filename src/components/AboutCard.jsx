import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

const profile = {
  name: 'Srikant Panda',
  role: 'Backend Engineer',
  description:
    'Backend engineer focused on scalable APIs, reliable services, and clean system design. I enjoy building robust platforms for distributed applications.',
    // imageUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Srikant%20Panda',
    imageUrl: '/icon.png',
    githubUrl: 'https://github.com/srikant-panda',
  linkedInUrl: 'https://www.linkedin.com/in/srikant-panda-66069432b',
}

function OutlineLink({ href, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-slate-100 transition duration-300 hover:bg-white/10"
    >
      {children}
    </motion.a>
  )
}

export default function AboutCard() {
  return (
    <GlassCard className="text-center">
      <div className="mx-auto mb-5 h-24 w-24 rounded-full border-2 border-purple-400/80 p-1 shadow-[0_0_40px_rgba(168,85,247,0.45)]">
        <img
          src={profile.imageUrl}
          alt="Srikant Panda profile"
          className="h-full w-full rounded-full bg-white/10 object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
      <p className="mt-1 text-sm font-medium text-indigo-200">{profile.role}</p>
      <p className="mt-3 text-sm text-slate-200/85">{profile.description}</p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <OutlineLink href={profile.githubUrl}>GitHub</OutlineLink>
        <OutlineLink href={profile.linkedInUrl}>LinkedIn</OutlineLink>
      </div>
    </GlassCard>
  )
}
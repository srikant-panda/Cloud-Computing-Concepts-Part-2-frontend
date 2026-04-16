import { motion } from 'framer-motion'
import SubmitFormCard from './components/SubmitFormCard'
import AboutCard from './components/AboutCard'
import GlowBackground from './components/GlowBackground'

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-indigo-950 to-black px-4 py-12 text-white md:py-16">
      <GlowBackground />

      <section className="relative mx-auto flex w-full max-w-[440px] flex-col items-center justify-center gap-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full"
        >
          <SubmitFormCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          className="w-full"
        >
          <AboutCard />
        </motion.div>
      </section>
    </main>
  )
}

export default App

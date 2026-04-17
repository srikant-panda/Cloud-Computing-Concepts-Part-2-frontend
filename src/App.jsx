import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SubmitFormCard from './components/SubmitFormCard'
import AboutCard from './components/AboutCard'
import GlowBackground from './components/GlowBackground'
import BackendHealthIndicator from './components/BackendHealthIndicator'
import VideoModal from './components/VideoModal'

function App() {
  const [isEligibilityVideoOpen, setEligibilityVideoOpen] = useState(true)
  const [isTokenVideoOpen, setTokenVideoOpen] = useState(false)

  useEffect(() => {
    const videoSources = ['/eligibility.mp4', '/get_token.mp4']

    const preloadedVideos = videoSources.map((src) => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.src = src
      video.load()
      return video
    })

    return () => {
      preloadedVideos.forEach((video) => {
        video.pause()
        video.removeAttribute('src')
        video.load()
      })
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#05151a] via-[#0d2f33] to-[#1b1510] px-4 py-12 text-white md:py-16">
      <GlowBackground />

      <VideoModal
        isOpen={isEligibilityVideoOpen}
        onClose={() => setEligibilityVideoOpen(false)}
        title="Check Eligibility"
        src="/eligibility.mp4"
        description="Watch this short guide before submitting your details."
        linkUrl="https://www.coursera.org/account-settings"
      />

      <VideoModal
        isOpen={isTokenVideoOpen}
        onClose={() => setTokenVideoOpen(false)}
        title="How to Get Token"
        src="/get_token.mp4"
        description="Follow these steps to generate a valid token."
        linkUrl="https://www.coursera.org/learn/cloud-computing-2/programming/LZqp6/fault-tolerant-key-value-store"
      />

      <div className="relative z-10 mx-auto mb-6 flex w-full max-w-[560px] justify-end">
        <BackendHealthIndicator />
      </div>

      <section className="relative mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full"
        >
          <SubmitFormCard onOpenTokenHelp={() => setTokenVideoOpen(true)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          className="w-full max-w-[440px]"
        >
          <AboutCard />
        </motion.div>
      </section>
    </main>
  )
}

export default App

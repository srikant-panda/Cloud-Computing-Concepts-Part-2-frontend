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
  const [selectedSemester, setSelectedSemester] = useState('')

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const shouldUseConservativePreload =
      isMobile || (navigator.connection && navigator.connection.saveData)

    const preloadedVideos = []

    const preloadVideo = (src, preload = 'metadata') => {
      const video = document.createElement('video')
      video.preload = preload
      video.src = src
      video.load()
      preloadedVideos.push(video)
    }

    preloadVideo('/eligibility.mp4', shouldUseConservativePreload ? 'metadata' : 'auto')

    if (!shouldUseConservativePreload && selectedSemester === 'SEM-4') {
      const idleCallback = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 250))
      idleCallback(() => preloadVideo('/get_token.mp4', 'metadata'))
    }

    return () => {
      preloadedVideos.forEach((video) => {
        video.pause()
        video.removeAttribute('src')
        video.load()
      })
    }
  }, [selectedSemester])

  const tokenHelpVideo =
    selectedSemester === 'SEM-3'
      ? {
          title: 'get_token2',
          src: '',
          description: 'Use the guide link below for SEM-3 token generation.',
          linkUrl: 'https://www.coursera.org/learn/cloud-computing/programming/O4lWE/gossip-protocol',
        }
      : {
          title: 'How to Get Token',
          src: '/get_token.mp4',
          description: 'Follow these steps to generate a valid token.',
          linkUrl:
            'https://www.coursera.org/learn/cloud-computing-2/programming/LZqp6/fault-tolerant-key-value-store',
        }

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
        title={tokenHelpVideo.title}
        src={tokenHelpVideo.src}
        description={tokenHelpVideo.description}
        linkUrl={tokenHelpVideo.linkUrl}
      />

      <section className="relative mx-auto flex w-full max-w-[980px] flex-col items-center justify-center gap-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full"
        >
          {selectedSemester === 'SEM-3' || selectedSemester === 'SEM-4' ? (
            <div className="mx-auto mb-1 w-full max-w-[560px] flex justify-end">
              <BackendHealthIndicator semester={selectedSemester} />
            </div>
          ) : null}

          <SubmitFormCard
            onSemesterChange={(semester) => {
              if (semester !== 'SEM-3' && semester !== 'SEM-4') {
                return
              }

              setSelectedSemester(semester)
            }}
            onOpenTokenHelp={(semester) => {
              if (semester !== 'SEM-3' && semester !== 'SEM-4') {
                return
              }

              setSelectedSemester(semester)
              setTokenVideoOpen(true)
            }}
          />
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

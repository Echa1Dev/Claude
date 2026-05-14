'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Nav from '@/components/layout/Nav'
import CustomCursor from '@/components/layout/CustomCursor'
import ScrollProgress from '@/components/layout/ScrollProgress'
import ScanlineOverlay from '@/components/effects/ScanlineOverlay'
import NoiseTexture from '@/components/effects/NoiseTexture'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ContactSection from '@/components/sections/ContactSection'

const ParticleField = dynamic(() => import('@/components/effects/ParticleField'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  useEffect(() => {
    // Register GSAP ScrollTrigger on client
    const initGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Refresh ScrollTrigger after hydration
      ScrollTrigger.refresh()
    }
    initGSAP()
  }, [])

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Fixed background effects */}
      <ParticleField />
      <ScanlineOverlay />
      <NoiseTexture />

      {/* Navigation */}
      <Nav />

      {/* Custom cursor (hidden on mobile) */}
      <CustomCursor />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Page sections */}
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  )
}

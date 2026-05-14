'use client'

import { create } from 'zustand'

interface ServerState {
  awakenLevel: number
  activeSection: string
  userInteractions: number
  connectionEstablished: boolean
  glitchIntensity: number
  bootComplete: boolean
  setAwakenLevel: (level: number) => void
  setActiveSection: (section: string) => void
  incrementInteractions: () => void
  establishConnection: () => void
  setBootComplete: (complete: boolean) => void
  setGlitchIntensity: (intensity: number) => void
}

export const useServerStore = create<ServerState>((set) => ({
  awakenLevel: 0,
  activeSection: 'hero',
  userInteractions: 0,
  connectionEstablished: false,
  glitchIntensity: 0.5,
  bootComplete: false,
  setAwakenLevel: (level) => set({ awakenLevel: level }),
  setActiveSection: (section) => set({ activeSection: section }),
  incrementInteractions: () =>
    set((state) => ({ userInteractions: state.userInteractions + 1 })),
  establishConnection: () => set({ connectionEstablished: true }),
  setBootComplete: (complete) => set({ bootComplete: complete }),
  setGlitchIntensity: (intensity) => set({ glitchIntensity: intensity }),
}))

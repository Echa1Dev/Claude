'use client'

type EventCallback = (data?: unknown) => void

class NarrativeEventSystem {
  private listeners: Map<string, EventCallback[]> = new Map()

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)

    return () => {
      const callbacks = this.listeners.get(event) ?? []
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event) ?? []
    callbacks.forEach((cb) => cb(data))
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event) ?? []
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }
}

export const narrativeEvents = new NarrativeEventSystem()

export const EVENTS = {
  BOOT_COMPLETE: 'boot:complete',
  SECTION_ENTER: 'section:enter',
  SECTION_LEAVE: 'section:leave',
  SKILL_REVEALED: 'skill:revealed',
  PROJECT_VIEWED: 'project:viewed',
  CONNECTION_ATTEMPT: 'connection:attempt',
  CONNECTION_SUCCESS: 'connection:success',
  GLITCH_TRIGGER: 'glitch:trigger',
} as const

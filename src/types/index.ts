export interface Project {
  id: string
  codename: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  status: 'COMPLETED' | 'ACTIVE' | 'ARCHIVED'
  year: string
  link?: string
  github?: string
}

export interface Skill {
  name: string
  level: number // 0-100
  category: SkillCategory
}

export type SkillCategory =
  | 'FRONTEND_SYSTEMS'
  | 'BACKEND_PROTOCOLS'
  | 'CREATIVE_ENGINES'
  | 'INFRASTRUCTURE'

export interface SkillGroup {
  id: SkillCategory
  label: string
  description: string
  skills: Skill[]
}

export interface ExperienceItem {
  id: string
  period: string
  startYear: number
  endYear: number | null
  title: string
  company: string
  description: string
  highlights: string[]
  tech: string[]
}

export interface NavItem {
  label: string
  href: string
  command: string
}

export interface BootLine {
  text: string
  delay: number
  type: 'system' | 'error' | 'success' | 'info'
}

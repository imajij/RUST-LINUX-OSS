// types.ts — the single typed shape of the whole app state.

export type TrackId = 'rust' | 'c' | 'rfl'
export type LeafStatus = 'todo' | 'done'
export type ContribType = 'pr' | 'issue'
export type ContribStatus = 'merged' | 'accepted' | 'submitted' | 'changes' | 'rejected' | 'draft'
export type ReadingStatus = 'todo' | 'reading' | 'done'
export type ThemeName = 'light' | 'dark'
export type QuestKind = 'study' | 'read' | 'roadmap'

export interface LeafItem {
  id: string
  type: 'leaf'
  title: string
  status: LeafStatus
  ref?: string
}

export interface Group {
  id: string
  title: string
  open: boolean
  items: LeafItem[]
}

export interface TrackNode {
  id: string
  track: TrackId
  name: string
  locked: boolean
  groups: Group[]
}

export interface StudyEntry {
  id: string
  date: string
  track: TrackId
  desc: string
  hours: number
}

export interface Contrib {
  id: string
  date: string
  project: string
  main: boolean
  type: ContribType
  status: ContribStatus
  title: string
  url: string
  starred?: boolean
}

export interface ReadingItem {
  id: string
  title: string
  url: string
  track: TrackId
  format: string
  status: ReadingStatus
  done: number
  total: number
}

export interface Goal {
  id: string
  title: string
  notes: string
  date: string
  done: boolean
}

export interface Quest {
  id: string
  icon: string
  label: string
  xp: number
  kind: QuestKind
  done: boolean
}

export interface Quests {
  date: string
  items: Quest[]
  claimed: string[]
  bonusClaimed?: boolean
}

export interface Profile {
  name: string
  username: string
  mainProject: string
  githubToken: string
}

export interface Dates {
  gsoc: string
  lfx: string
  internship: string
}

export interface Settings {
  theme: ThemeName
  accent: string
  font: string
  density: string
  partialCredit: boolean
  dates: Dates
}

export interface AppState {
  profile: Profile
  settings: Settings
  phase: number
  activity: Record<string, number>
  study: StudyEntry[]
  contribs: Contrib[]
  roadmap: TrackNode[]
  reading: ReadingItem[]
  goals: Goal[]
  quests: Quests
  xpBonus: number
  seenLevel: number | null
}

// github.ts — fetch a user's PRs via the public GitHub Search API and map them
// to Contrib records. No backend; an optional token lifts the rate limit.

import type { Contrib, ContribStatus } from '../types'

interface SearchItem {
  id: number
  title: string
  html_url: string
  created_at: string
  state: 'open' | 'closed'
  repository_url: string
  pull_request?: { merged_at: string | null }
}
interface SearchResponse { total_count: number; items: SearchItem[] }

export interface FetchResult { contribs: Contrib[]; total: number; truncated: boolean }

function statusFor(it: SearchItem): ContribStatus {
  if (it.pull_request?.merged_at) return 'merged'
  if (it.state === 'open') return 'submitted'
  return 'rejected'
}
function projectFor(it: SearchItem): string {
  return it.repository_url.split('/repos/')[1] ?? it.repository_url
}

export async function fetchUserPRs(username: string, token: string, mainProject: string): Promise<FetchResult> {
  const clean = username.trim().replace(/^@/, '')
  if (!clean) throw new Error('Add your GitHub username in Settings first.')

  const q = encodeURIComponent(`type:pr author:${clean}`)
  const url = `https://api.github.com/search/issues?q=${q}&sort=created&order=desc&per_page=100`
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  if (token.trim()) headers.Authorization = `Bearer ${token.trim()}`

  let res: Response
  try {
    res = await fetch(url, { headers })
  } catch {
    throw new Error('Network error — could not reach GitHub.')
  }
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) throw new Error('GitHub rate limit reached. Add a token in Settings, or try again in a minute.')
    if (res.status === 422) throw new Error(`GitHub rejected the query for "${clean}".`)
    throw new Error(`GitHub returned ${res.status}.`)
  }

  const json = (await res.json()) as SearchResponse
  const items = Array.isArray(json.items) ? json.items : []
  const contribs: Contrib[] = items.map((it) => {
    const project = projectFor(it)
    return {
      id: 'gh-' + it.id,
      date: it.created_at.slice(0, 10),
      project,
      main: !!mainProject && project === mainProject,
      type: 'pr',
      status: statusFor(it),
      title: it.title,
      url: it.html_url,
    }
  })
  return { contribs, total: json.total_count ?? items.length, truncated: (json.total_count ?? 0) > items.length }
}
